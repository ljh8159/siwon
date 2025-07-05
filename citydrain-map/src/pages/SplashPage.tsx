import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function SplashPage() {
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      history.replace('/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [history]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#424fb5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <img
        src={process.env.PUBLIC_URL + '/picture/floodloading.png'}
        alt="로딩"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}

export default SplashPage;