# 로컬 개발 환경 설정 (배포 DB 사용)
import os

# Flask 설정
os.environ['FLASK_ENV'] = 'development'
os.environ['FLASK_DEBUG'] = '1'
os.environ['PORT'] = '5001'

# 업로드 폴더 설정
os.environ['UPLOAD_FOLDER'] = 'uploads'

# 배포 데이터베이스 연결 설정
# 실제 Railway PostgreSQL 데이터베이스 URL
os.environ['DATABASE_URL'] = 'postgresql://postgres:yIWlfFGFZPNBRibkancSvXAhaasbsgyK@interchange.proxy.rlwy.net:11563/railway'

print("💾 Railway PostgreSQL 데이터베이스에 연결합니다.")
print("🔗 DATABASE_URL이 설정되었습니다.") 