import React from "react";
import { useHistory } from "react-router-dom";

export default function DispatchFinishConfirm() {
  const history = useHistory();

  const handleConfirm = () => {
    history.push("/dispatch/photo_upload");
  };

  const handleCancel = () => {
    history.push("/dispatch/cleaning");
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
          청소 완료 확인
        </h2>
        <div style={{ marginBottom: 32 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/190/190411.png"
            alt="완료"
            style={{ width: 80, height: 80, opacity: 0.7 }}
          />
        </div>
        <div style={{ fontSize: 16, color: "#555", marginBottom: 24, textAlign: "center" }}>
          하수구 청소가 완료되었나요?<br />
          완료되었다면 아래 버튼을 눌러주세요.
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
            onClick={handleCancel}
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
}