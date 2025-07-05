import os
import psycopg2
import psycopg2.extras
import sqlite3
from flask import Flask, request, jsonify, send_from_directory, g
from flask_cors import CORS
from werkzeug.utils import secure_filename

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import hashlib
import secrets
from datetime import datetime, timedelta
import base64

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# 모델 로딩
MODEL_PATH = 'mobilenetv2_stage_model.h5'
MODEL_IMG_SIZE = (224, 224)

# 모델 파일이 있는지 확인하고 없으면 base64에서 복원
if not os.path.exists(MODEL_PATH):
    try:
        print("Model file not found, trying to decode from base64")
        with open('model.b64', 'r') as f:
            model_base64 = f.read()
        model_data = base64.b64decode(model_base64)
        with open(MODEL_PATH, 'wb') as f:
            f.write(model_data)
        print("Successfully decoded model file")
    except Exception as e:
        print(f"Error decoding model file: {str(e)}")

try:
    print(f"Loading model from {MODEL_PATH}")
    model = load_model(MODEL_PATH)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        database_url = os.environ.get("DATABASE_URL")
        if database_url:
            # 프로덕션 환경: PostgreSQL 사용
            db = g._database = psycopg2.connect(database_url)
        else:
            # 로컬 개발 환경: SQLite 사용
            db = g._database = sqlite3.connect('reports.db')
            db.row_factory = sqlite3.Row
    return db

def get_placeholder():
    """데이터베이스 타입에 따른 파라미터 플레이스홀더 반환"""
    return "%s" if os.environ.get("DATABASE_URL") else "?"

def is_postgres():
    """현재 데이터베이스가 PostgreSQL인지 확인"""
    return bool(os.environ.get("DATABASE_URL"))

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        cur = db.cursor()
        # PostgreSQL과 SQLite 모두 호환되는 테이블 생성
        if os.environ.get("DATABASE_URL"):
            # PostgreSQL
            cur.execute('''
                CREATE TABLE IF NOT EXISTS reports (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT,
                    type TEXT,
                    photo_filename TEXT,
                    location TEXT,
                    lat REAL,
                    lng REAL,
                    timestamp TEXT,
                    ai_stage INTEGER,
                    extra TEXT,
                    dispatch_user_id TEXT,
                    for_userpage_type TEXT,
                    for_userpage_stage INTEGER
                )
            ''')
        else:
            # SQLite
            cur.execute('''
                CREATE TABLE IF NOT EXISTS reports (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT,
                    type TEXT,
                    photo_filename TEXT,
                    location TEXT,
                    lat REAL,
                    lng REAL,
                    timestamp TEXT,
                    ai_stage INTEGER,
                    extra TEXT,
                    dispatch_user_id TEXT,
                    for_userpage_type TEXT,
                    for_userpage_stage INTEGER
                )
            ''')
        db.commit()
        cur.close()

def init_user_table():
    with app.app_context():
        db = get_db()
        cur = db.cursor()
        if os.environ.get("DATABASE_URL"):
            # PostgreSQL
            cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT UNIQUE,
                    password TEXT
                )
            ''')
        else:
            # SQLite
            cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT UNIQUE,
                    password TEXT
                )
            ''')
        db.commit()
        cur.close()

init_db()
init_user_table()

@app.route('/')
def index():
    return "Flask 서버가 실행 중입니다."

@app.route('/reports')
def reports_page():
    return "신고/출동 API 서버입니다."

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload_photo', methods=['POST'])
def upload_photo():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'filename': filename})
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/predict', methods=['POST'])
def predict():
    # 모델이 로드되지 않은 경우
    if model is None:
        return jsonify({'error': 'Model is not loaded. Image analysis is currently unavailable.'}), 503
        
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404

    try:
        img = image.load_img(file_path, target_size=MODEL_IMG_SIZE)
        x = image.img_to_array(img)
        x = x / 255.0
        x = np.expand_dims(x, axis=0)
        preds = model.predict(x)
        stage = int(np.argmax(preds)) + 1
        return jsonify({'stage': stage})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/report', methods=['POST'])
def save_report():
    data = request.get_json()
    user_id = data.get('user_id', 'guest')
    type_ = data.get('type', '')
    photo_filename = data.get('photo_filename')
    location = data.get('location')
    lat = data.get('lat')
    lng = data.get('lng')
    timestamp = data.get('timestamp')
    ai_stage = data.get('ai_stage')
    extra = data.get('extra', '')
    dispatch_user_id = data.get('dispatch_user_id', None)
    for_userpage_type = data.get('for_userpage_type', type_)
    for_userpage_stage = data.get('for_userpage_stage', ai_stage)

    if not timestamp:
        kst = datetime.utcnow() + timedelta(hours=9)
        timestamp = kst.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + '+09:00'

    db = get_db()
    cur = db.cursor()
    placeholder = get_placeholder()
    query = f'''INSERT INTO reports 
        (user_id, type, photo_filename, location, lat, lng, timestamp, ai_stage, extra, dispatch_user_id, for_userpage_type, for_userpage_stage)
        VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})'''
    cur.execute(query, (user_id, type_, photo_filename, location, lat, lng, timestamp, ai_stage, extra, dispatch_user_id, for_userpage_type, for_userpage_stage))
    db.commit()
    cur.close()
    return jsonify({'result': 'success'})

@app.route('/api/report_update', methods=['POST'])
def update_report():
    data = request.get_json()
    location = data.get('location')
    dispatch_user_id = data.get('dispatch_user_id', None)
    db = get_db()
    cur = db.cursor()
    placeholder = get_placeholder()
    query = f"UPDATE reports SET type='출동', ai_stage=1, dispatch_user_id={placeholder} WHERE location={placeholder} AND type='신고'"
    cur.execute(query, (dispatch_user_id, location))
    db.commit()
    cur.close()
    return jsonify({'result': 'updated'})

@app.route('/api/report_stats', methods=['GET'])
def report_stats():
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT COUNT(*) FROM reports WHERE type='신고' AND ai_stage=3")
    blocked_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM reports WHERE type='출동' AND ai_stage=1")
    dispatched_count = cur.fetchone()[0]
    cur.close()
    return jsonify({
        "blocked_count": blocked_count,
        "dispatched_count": dispatched_count
    })

@app.route('/api/all_reports', methods=['GET'])
def all_reports():
    limit = request.args.get('limit', default=3, type=int)
    db = get_db()
    
    if is_postgres():
        cur = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    else:
        cur = db.cursor()
    
    placeholder = get_placeholder()
    query = f"SELECT type, location, timestamp FROM reports WHERE type='신고' AND ai_stage=3 ORDER BY timestamp DESC LIMIT {placeholder}"
    cur.execute(query, (limit,))
    
    reports = []
    from datetime import datetime, timezone
    import math
    
    for row in cur.fetchall():
        if is_postgres():
            row_dict = dict(row)
        else:
            row_dict = dict(row)
        
        try:
            t = datetime.fromisoformat(row_dict['timestamp'].replace('Z', '+00:00'))
            now = datetime.now(timezone.utc)
            diff = now - t
            seconds = diff.total_seconds()
            if seconds < 60:
                time_str = f"{int(seconds)}초 전"
            elif seconds < 3600:
                minutes = int(seconds // 60)
                time_str = f"{minutes}분 전"
            elif seconds < 86400:
                hours = int(seconds // 3600)
                time_str = f"{hours}시간 전"
            elif diff.days < 30:
                time_str = f"{diff.days}일 전"
            else:
                months = math.floor(diff.days / 30)
                time_str = f"{months}달 전"
        except Exception:
            time_str = ""
        
        reports.append({
            "type": row_dict["type"],
            "location": row_dict["location"],
            "timestamp": row_dict["timestamp"],
            "time": time_str
        })
    
    cur.close()
    return jsonify(reports)

@app.route('/api/user_reports', methods=['GET'])
def user_reports():
    user_id = request.args.get('user_id', 'guest')
    limit = request.args.get('limit', default=3, type=int)
    db = get_db()
    
    if is_postgres():
        cur = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    else:
        cur = db.cursor()
    
    placeholder = get_placeholder()
    query = f"""SELECT type, location, timestamp FROM reports WHERE user_id={placeholder} AND for_userpage_type='신고' AND for_userpage_stage=3 
        UNION ALL 
        SELECT type, location, timestamp FROM reports WHERE dispatch_user_id={placeholder} AND type='출동' AND ai_stage=1 
        ORDER BY timestamp DESC LIMIT {placeholder}"""
    cur.execute(query, (user_id, user_id, limit))
    
    reports = []
    from datetime import datetime, timezone
    import math
    
    for row in cur.fetchall():
        if is_postgres():
            row_dict = dict(row)
        else:
            row_dict = dict(row)
        
        try:
            t = datetime.fromisoformat(row_dict['timestamp'].replace('Z', '+00:00'))
            now = datetime.now(timezone.utc)
            diff = now - t
            seconds = diff.total_seconds()
            if seconds < 60:
                time_str = f"{int(seconds)}초 전"
            elif seconds < 3600:
                minutes = int(seconds // 60)
                time_str = f"{minutes}분 전"
            elif seconds < 86400:
                hours = int(seconds // 3600)
                time_str = f"{hours}시간 전"
            elif diff.days < 30:
                time_str = f"{diff.days}일 전"
            else:
                months = math.floor(diff.days / 30)
                time_str = f"{months}달 전"
        except Exception:
            time_str = ""
        
        reports.append({
            "type": row_dict["type"],
            "location": row_dict["location"],
            "timestamp": row_dict["timestamp"],
            "time": time_str
        })
    
    cur.close()
    return jsonify(reports)

@app.route('/api/user_stats', methods=['GET'])
def user_stats():
    user_id = request.args.get('user_id', 'guest')
    db = get_db()
    cur = db.cursor()
    placeholder = get_placeholder()
    
    query = f"SELECT COUNT(*) FROM reports WHERE user_id={placeholder} AND for_userpage_type='신고' AND for_userpage_stage=3"
    cur.execute(query, (user_id,))
    report_count = cur.fetchone()[0]
    
    query = f"SELECT COUNT(*) FROM reports WHERE dispatch_user_id={placeholder} AND type='출동' AND ai_stage=1"
    cur.execute(query, (user_id,))
    dispatch_count = cur.fetchone()[0]
    
    cur.close()
    return jsonify({
        "report_count": report_count,
        "dispatch_count": dispatch_count
    })

@app.route('/api/user_point', methods=['GET'])
def user_point():
    user_id = request.args.get('user_id', 'guest')
    db = get_db()
    cur = db.cursor()
    placeholder = get_placeholder()
    
    query = f"SELECT COUNT(*) FROM reports WHERE user_id={placeholder} AND for_userpage_type='신고' AND for_userpage_stage=3"
    cur.execute(query, (user_id,))
    report_count = cur.fetchone()[0]
    
    query = f"SELECT COUNT(*) FROM reports WHERE dispatch_user_id={placeholder} AND type='출동' AND ai_stage=1"
    cur.execute(query, (user_id,))
    dispatch_count = cur.fetchone()[0]
    
    cur.close()
    point = report_count * 5000 + dispatch_count * 10000
    return jsonify({"point": point})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')
    if not user_id or not password:
        return jsonify({'error': '아이디/비밀번호 필요'}), 400
    
    db = get_db()
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    cur = db.cursor()
    placeholder = get_placeholder()
    
    try:
        query = f'INSERT INTO users (user_id, password) VALUES ({placeholder}, {placeholder})'
        cur.execute(query, (user_id, hashed_pw))
        db.commit()
        cur.close()
        return jsonify({'result': 'success'})
    except (psycopg2.IntegrityError, sqlite3.IntegrityError):
        db.rollback()
        cur.close()
        return jsonify({'error': '이미 존재하는 아이디'}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')
    if not user_id or not password:
        return jsonify({'error': '아이디/비밀번호 필요'}), 400
    
    db = get_db()
    
    if is_postgres():
        cur = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    else:
        cur = db.cursor()
    
    placeholder = get_placeholder()
    query = f'SELECT * FROM users WHERE user_id={placeholder}'
    cur.execute(query, (user_id,))
    user = cur.fetchone()
    cur.close()
    
    if not user:
        return jsonify({'error': '존재하지 않는 아이디'}), 400
    
    if is_postgres():
        user_dict = dict(user)
    else:
        user_dict = dict(user)
    
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    if user_dict['password'] != hashed_pw:
        return jsonify({'error': '비밀번호 불일치'}), 400
    
    token = secrets.token_hex(16)
    return jsonify({'result': 'success', 'token': token})

@app.route('/api/reports', methods=['GET'])
def api_reports():
    db = get_db()
    
    if is_postgres():
        cur = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    else:
        cur = db.cursor()
    
    cur.execute("SELECT lat, lng, location, timestamp FROM reports WHERE type='신고' AND ai_stage=3")
    
    reports = []
    for row in cur.fetchall():
        if is_postgres():
            row_dict = dict(row)
        else:
            row_dict = dict(row)
        
        reports.append({
            "lat": row_dict["lat"],
            "lng": row_dict["lng"],
            "location": row_dict["location"],
            "timestamp": row_dict["timestamp"]
        })
    
    cur.close()
    return jsonify(reports)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/admin_reports', methods=['GET'])
def admin_reports():
    db = get_db()
    
    if is_postgres():
        cur = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    else:
        cur = db.cursor()
    
    cur.execute("SELECT id, type, location, timestamp FROM reports WHERE type='신고' AND ai_stage=2 ORDER BY timestamp DESC")
    
    reports = []
    from datetime import datetime, timezone
    import math
    
    for row in cur.fetchall():
        if is_postgres():
            row_dict = dict(row)
        else:
            row_dict = dict(row)
        
        try:
            t = datetime.fromisoformat(row_dict['timestamp'].replace('Z', '+00:00'))
            now = datetime.now(timezone.utc)
            diff = now - t
            seconds = diff.total_seconds()
            if seconds < 60:
                time_str = f"{int(seconds)}초 전"
            elif seconds < 3600:
                minutes = int(seconds // 60)
                time_str = f"{minutes}분 전"
            elif seconds < 86400:
                hours = int(seconds // 3600)
                time_str = f"{hours}시간 전"
            elif diff.days < 30:
                time_str = f"{diff.days}일 전"
            else:
                months = math.floor(diff.days / 30)
                time_str = f"{months}달 전"
        except Exception:
            time_str = ""
        
        reports.append({
            "id": row_dict["id"],
            "type": row_dict["type"],
            "location": row_dict["location"],
            "timestamp": row_dict["timestamp"],
            "time": time_str
        })
    
    cur.close()
    return jsonify(reports)

@app.route('/api/admin_approve', methods=['POST'])
def admin_approve():
    data = request.get_json()
    report_id = data.get('id')
    stage = data.get('ai_stage')  # 3(승인), 5(취소)
    if not report_id or stage not in [3, 5]:
        return jsonify({'result': 'fail', 'error': 'invalid params'}), 400
    
    db = get_db()
    cur = db.cursor()
    placeholder = get_placeholder()
    query = f"UPDATE reports SET ai_stage={placeholder}, for_userpage_stage={placeholder} WHERE id={placeholder}"
    cur.execute(query, (stage, stage, report_id))
    db.commit()
    cur.close()
    return jsonify({'result': 'success'})

if __name__ == '__main__':
    init_db()
    init_user_table()
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))