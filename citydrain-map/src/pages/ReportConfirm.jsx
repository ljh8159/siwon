import React from "react";

export default function ReportConfirm({ photoUrl, location, lat, lng, onSubmit, onRetry }) {
  // photoUrl이 문자열이 아니거나 비어있으면 예외 처리
  if (typeof photoUrl !== "string" || !photoUrl) {
    return (
      <div style={{ padding: 32, color: "red" }}>
        사진 정보가 올바르지 않습니다.<br />
        <button onClick={onRetry} style={{ marginTop: 16 }}>다시 시도</button>
      </div>
    );
  }

  // location이 문자열이 아닐 경우 빈 문자열 처리
  const locationText = typeof location === "string" ? location : "";

  // 신고 버튼 클릭 시 user_id도 함께 전달
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(photoUrl, location, lat, lng, localStorage.getItem("user_id"));
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
          신고 사진 확인
        </h2>
        <div style={{ marginBottom: 32 }}>
          <img
            src={photoUrl}
            alt="업로드 사진"
            style={{
              width: 220,
              height: 160,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #eee",
            }}
          />
        </div>
        {locationText && (
          <div style={{ fontSize: 15, color: "#888", marginBottom: 24 }}>
            위치: {locationText}
          </div>
        )}
        {(lat !== undefined && lng !== undefined) && (
          <div style={{ fontSize: 14, color: "#888", marginBottom: 12 }}>
            좌표: {lat}, {lng}
          </div>
        )}
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
            onClick={handleSubmit}
          >
            신고
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
            onClick={onRetry}
          >
            재촬영
          </button>
        </div>
      </div>
    </div>
  );
}