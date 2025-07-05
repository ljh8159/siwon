import React from "react";
import { useHistory } from "react-router-dom";

export default function ReportResultStage2() {
  const history = useHistory();

  const handleNext = () => {
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
        <h2 style={{ color: "#f39c12", fontSize: 22, fontWeight: 700, marginBottom: 32 }}>
          2단계: 관리자 확인 필요
        </h2>
        <div style={{ marginBottom: 32 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/190/190406.png"
            alt="부분 막힘"
            style={{ width: 80, height: 80, opacity: 0.7 }}
          />
        </div>
        <div style={{ fontSize: 16, color: "#555", marginBottom: 24, textAlign: "center" }}>
          하수구가 부분적으로 막혀 있습니다.<br />
          관리자 확인 후, 신고/반려 처리됩니다.
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
          onClick={handleNext}
        >
          홈으로
        </button>
      </div>
    </div>
  );
}