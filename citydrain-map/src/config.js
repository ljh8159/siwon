const config = {
  // Railway에서 설정한 환경변수를 사용하거나, 기본값으로 로컬 주소 사용
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
};

export default config; 