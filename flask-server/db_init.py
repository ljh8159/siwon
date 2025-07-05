import sqlite3

conn = sqlite3.connect('reports.db')
cur = conn.cursor()

# reports 테이블(이미 있을 수 있음, 예시)
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
    extra TEXT
)
''')

# users 테이블(로그인 기능용, 반드시 필요)
cur.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE,
    password TEXT
)
''')

conn.commit()
conn.close()
