import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../styles/LoginPage.module.css';
import floodmark from '../assets/floodmark.png'; // 이미지 import
import moismark from '../assets/moismark.png';   // 필요시 추가

const API_URL = process.env.REACT_APP_API_URL || 'https://backendflask-production-f4c6.up.railway.app';

function LoginPage({ setIsLoggedIn, setUserId }: { setIsLoggedIn: (v: boolean) => void, setUserId: (v: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(
        `${API_URL}/api/login`,
        { user_id: username, password }
      );
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user_id', username);
        setIsLoggedIn(true);
        setUserId(username);
        history.push('/');
      } else {
        setError('로그인 실패: 서버 응답 오류');
      }
    } catch (err) {
      setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  const handleSignup = () => {
    history.push('/signup');
  };

  return (
    <div className={styles.bodyBackground}>
      <div className={styles.container}>
        <img
          src={floodmark}
          alt="로그인 이미지"
          style={{
            width: '100%',
            height: 220,
            objectFit: 'contain',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            marginBottom: 12,
          }}
        />
        <div
          style={{
            fontWeight: 900,
            fontSize: 32,
            letterSpacing: '2px',
            marginBottom: 24,
            color: '#fff',
            background: 'linear-gradient(90deg, #4b89e5 0%, #ffd600 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '2px 2px 8px rgba(75,137,229,0.15), 0 2px 8px #ffd60044'
          }}
        >
          도로뚫이단
        </div>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.inputField}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
            required
          />
          {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
          <button type="submit" className={styles.loginButton}>로그인</button>
          <button type="button" className={styles.signupButton} onClick={handleSignup}>회원가입</button>
        </form>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <img
            src={moismark}
            alt="행정안전부 마크"
            style={{ height: 200, objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;