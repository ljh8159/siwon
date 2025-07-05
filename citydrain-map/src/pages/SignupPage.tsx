import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import config from '../config';

const API_URL = config.API_URL;

function SignupPage() {
  const [form, setForm] = useState({ user_id: '', password: '' });
  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.result === 'success' ? '회원가입 성공!' : (data.error || '회원가입 실패'));
      if (data.result === 'success') {
        history.push('/login');
      }
    } catch (err) {
      alert('회원가입 실패');
    }
  };

  return (
    <div
      className="iphone-frame"
      style={{
        width: 393,
        height: 852,
        background: "#fff",
        borderRadius: 32,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      <div
        className="container"
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          padding: "64px 32px 0 32px",
          overflowY: "auto",
          borderRadius: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ marginBottom: 32, fontWeight: 700, fontSize: 28 }}>회원가입</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            name="user_id"
            type="text"
            placeholder="아이디"
            value={form.user_id}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              marginBottom: 16,
              padding: 12,
              fontSize: 16,
              borderRadius: 8,
              border: "1px solid #eee",
              boxSizing: "border-box",
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              marginBottom: 24,
              padding: 12,
              fontSize: 16,
              borderRadius: 8,
              border: "1px solid #eee",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 14,
              background: "#ffd600",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 18,
              color: "#222",
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;