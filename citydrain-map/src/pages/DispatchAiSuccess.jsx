import React from "react";
import { useHistory } from "react-router-dom";

export default function DispatchAiSuccess() {
  const history = useHistory();

  const handleHome = () => {
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
        <h2 style={{ color: "#4b53e5", fontSize: 22, fontWeight: 700, marginBottom: 32 }}>
          출동 완료!
        </h2>
        <div style={{ marginBottom: 32 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/190/190411.png"
            alt="성공"
            style={{ width: 80, height: 80, opacity: 0.7 }}
          />
        </div>
        <div style={{ fontSize: 16, color: "#555", marginBottom: 24, textAlign: "center" }}>
          출동 확인되었습니다.<br />
          수고하셨습니다!
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
          onClick={handleHome}
        >
          홈으로
        </button>
      </div>
    </div>
  );
}