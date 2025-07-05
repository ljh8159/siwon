const config = {
  // Railway에서 설정한 환경변수를 사용하거나, 기본값으로 Railway 백엔드 주소 사용
  API_URL: process.env.REACT_APP_API_URL || 'https://backendflask-production-f4c6.up.railway.app'
};

export default config; 