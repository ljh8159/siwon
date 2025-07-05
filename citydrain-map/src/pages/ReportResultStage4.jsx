import React from "react";
import { useHistory } from "react-router-dom";

export default function ReportResultStage4() {
  const history = useHistory();

  const handleYes = () => {
    history.push("/safekorea_iframe");
  };

  const handleNo = () => {
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
          4단계: 매우 심각한 막힘
        </h2>
        <div style={{ marginBottom: 32 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/190/190406.png"
            alt="매우 심각한 막힘"
            style={{ width: 80, height: 80, opacity: 0.7 }}
          />
        </div>
        <div style={{ fontSize: 16, color: "#555", marginBottom: 24, textAlign: "center" }}>
          홍수 피해가 심각합니다.<br />
          공공기관 사이트에 연결해 드릴까요?<br />
          
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
            onClick={handleYes}
          >
            예
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
            onClick={handleNo}
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
}