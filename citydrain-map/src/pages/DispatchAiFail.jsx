import React from "react";
import { useHistory } from "react-router-dom";

export default function DispatchAiFail() {
  const history = useHistory();

  const handleRetry = () => {
    history.push("/dispatch/cleaning");
  };

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
        <h2 style={{ color: "#e74c3c", fontSize: 22, fontWeight: 700, marginBottom: 32 }}>
          청소 미완료
        </h2>
        <div style={{ marginBottom: 32 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/753/753345.png"
            alt="실패"
            style={{ width: 80, height: 80, opacity: 0.7 }}
          />
        </div>
        <div style={{ fontSize: 16, color: "#555", marginBottom: 24, textAlign: "center" }}>
          아직 청소가 완료되지 않았습니다.<br />
          청소를 다시 진행한 후 시도해 주세요.
        </div>
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
            onClick={handleRetry}
          >
            청소 다시하기
          </button>
          <button
            type="button"
            style={{
              padding: "14px 32px",
              background: "#ededed",
              color: "#888",
              fontSize: 18,
              fontWeight: 500,
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
            }}
            onClick={handleHome}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}