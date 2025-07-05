import React from "react";
import floodmarkImg from "../assets/floodmark.png";

export default function DispatchCleaning({ onFinish }) {
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
          청소 중입니다..
        </h2>
        <div style={{ marginBottom: 32 }}>
          <img
            src={floodmarkImg}
            alt="청소"
            style={{ width: 120, height: 120, opacity: 0.95, borderRadius: "50%" }}
          />
        </div>
        <div style={{ fontSize: 16, color: "#555", marginBottom: 24, textAlign: "center" }}>
          낙엽, 쓰레기 등 하수구를 깨끗이 청소해주세요.<br />
          완료 후 아래 버튼을 눌러주세요.
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
          onClick={onFinish}
        >
          청소 완료
        </button>
      </div>
    </div>
  );
}