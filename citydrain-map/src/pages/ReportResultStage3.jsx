import React from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function ReportResultStage3({ photoUrl, location, onNext }) {
  const history = useHistory();
  const loc = useLocation();

  // location이 props로 없으면, useLocation().state에서 가져옴
  const photo = photoUrl || (loc.state && loc.state.photoUrl);
  const locValue = location || (loc.state && loc.state.location);

  const handleNext = () => {
    // 완료화면 진입 시 시간, 사진, 위치를 함께 전달
    const completeTime = new Date().toISOString();
    if (onNext) {
      onNext();
    } else {
      history.push("/report/complete", {
        photoUrl: photo,
        location: locValue,
        completeTime,
      });
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
        <h2 style={{ color: "#e67e22", fontSize: 22, fontWeight: 700, marginBottom: 32 }}>
          3단계: 심각한 막힘
        </h2>
        <div style={{ marginBottom: 32 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/190/190406.png"
            alt="심각한 막힘"
            style={{ width: 80, height: 80, opacity: 0.7 }}
          />
        </div>
        <div style={{ fontSize: 16, color: "#555", marginBottom: 24, textAlign: "center" }}>
          하수구가 심각하게 막혀 있습니다.<br />
          빠른 출동이 필요합니다.<br />
          신고해주셔서 감사합니다!
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
          완료
        </button>
      </div>
    </div>
  );
}