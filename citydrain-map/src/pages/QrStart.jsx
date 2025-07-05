import React from "react";
import { useHistory } from "react-router-dom";

export default function QrStart() {
  const history = useHistory();

  // QR 버튼 클릭 시 qr_input으로 이동
  const handleQrClick = () => {
    history.push("/qr_input");
  };

  // 홈으로 버튼 클릭 시 home으로 이동
  const handleHomeClick = () => {
    history.push("/");
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
          하수구 옆 QR을 찍어주세요!
        </h2>
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={handleQrClick}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/1828/1828919.png"
              alt="QR"
              style={{ width: 80, height: 80, opacity: 0.7 }}
            />
          </button>
        </div>
        <div style={{ fontSize: 16, color: "#555", marginBottom: 24, textAlign: "center" }}>
          신고/출동하려면<br />
          해당 위치의 하수구 QR을 찍어야 합니다.
        </div>
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
            marginTop: 24,
          }}
          onClick={handleHomeClick}
        >
          홈으로
        </button>
      </div>
    </div>
  );
}