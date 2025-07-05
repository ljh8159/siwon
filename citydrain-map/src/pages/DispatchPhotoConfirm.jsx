import React from "react";
import { useLocation } from "react-router-dom";

export default function DispatchPhotoConfirm({ photoUrl: propPhotoUrl, onConfirm, onRetry }) {
  const location = useLocation();
  // 우선순위: props > location.state
  const photoUrl = propPhotoUrl || (location.state && location.state.photoUrl);

  // 출동 확정 시 user_id도 함께 전달
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(photoUrl, localStorage.getItem("user_id"));
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
          사진 확인
        </h2>
        <div style={{ marginBottom: 32 }}>
          {photoUrl ? (
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
          ) : (
            <div
              style={{
                width: 220,
                height: 160,
                background: "#f0f0f0",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#aaa",
                fontSize: 16,
              }}
            >
              사진이 없습니다
            </div>
          )}
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
            onClick={handleConfirm}
          >
            확인
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