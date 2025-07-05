import React, { useState } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import config from '../config';

const API_URL = config.API_URL;

export default function DispatchAiCheck({ onSuccess, onFail }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // 업로드된 파일명은 이전 페이지에서 props 또는 location.state로 전달됨
  const photoUrl = location.state?.photoUrl;
  // 예: photoUrl = "https://your-backend-url.up.railway.app/uploads/image_1234567890.png"
  // 파일명만 추출
  const filename = photoUrl ? photoUrl.split("/").pop() : null;

  const handleNext = async () => {
    if (!filename) {
      alert("이미지 파일 정보가 없습니다.");
      return;
    }
    setLoading(true);
    try {
      // Flask 서버에 예측 요청
      const res = await axios.post(`${API_URL}/api/predict`, {
        filename,
      });
      const stage = res.data.stage;
      setLoading(false);
      if (stage === 1) {
        onSuccess && onSuccess();
      } else {
        onFail && onFail();
      }
    } catch (e) {
      setLoading(false);
      alert("AI 예측에 실패했습니다.");
      onFail && onFail();
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
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="container"
        style={{
          width: "100%",
          padding: "32px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#222", fontSize: 22, fontWeight: 700, marginBottom: 32 }}>
          인공지능 판별 중
        </h2>
        <div style={{ marginBottom: 32 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/833/833472.png"
            alt="AI"
            style={{ width: 80, height: 80, opacity: 0.7 }}
          />
        </div>
        <div style={{ fontSize: 16, color: "#555", marginBottom: 24 }}>
          인공지능이 사진을 분석하고 있습니다.<br />
          잠시만 기다려주세요.
        </div>
        {loading ? (
          <div style={{ marginTop: 24, fontSize: 16, color: "#888" }}>
            분석 중...
          </div>
        ) : (
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            <button
              type="button"
              style={{
                padding: "14px 32px",
                background: "#aab3ff",
                color: "#fff",
                fontSize: 18,
                fontWeight: 500,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
              }}
              onClick={handleNext}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}