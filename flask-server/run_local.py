#!/usr/bin/env python3
"""
로컬 개발 환경에서 Flask 서버 실행 스크립트 (배포 DB 사용)
"""

import os
import sys
from config_local import *

# 현재 디렉토리를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

if __name__ == '__main__':
    print("🚀 로컬 개발 서버를 시작합니다...")
    print(f"📍 서버 주소: http://localhost:{os.environ.get('PORT', 5001)}")
    print("🔧 개발 모드로 실행 중...")
    print("📁 업로드 폴더:", os.environ.get('UPLOAD_FOLDER', 'uploads'))
    
    # 데이터베이스 연결 확인
    if os.environ.get('DATABASE_URL'):
        print("💾 데이터베이스: 배포 PostgreSQL 사용")
    else:
        print("⚠️  경고: DATABASE_URL이 설정되지 않았습니다!")
        print("📝 config_local.py에서 DATABASE_URL을 설정해주세요.")
        print("🔗 배포 환경의 DATABASE_URL을 복사해서 설정하세요.")
    
    print("=" * 50)
    
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5001)),
        debug=True
    ) 