import React from "react";
import { useHistory } from "react-router-dom";

export default function SafekoreaIframe() {
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
          height: "100%",
          padding: "0",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#e74c3c", fontSize: 22, fontWeight: 700, margin: "32px 0 16px 0" }}>
          국민재난안전포털
        </h2>
        <div style={{ width: "100%", flex: 1, marginBottom: 16 }}>
          <iframe
            src="https://www.safekorea.go.kr/"
            title="국민재난안전포털"
            width="100%"
            height="100%"
            style={{
              border: "none",
              borderRadius: 12,
              minHeight: 600,
              minWidth: "100%",
              background: "#f8f8f8",
            }}
          />
        </div>
        <button
          type="button"
          style={{
            width: "90%",
            padding: "14px 0",
            background: "#aab3ff",
            color: "#fff",
            fontSize: 18,
            fontWeight: 500,
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            margin: "16px 0 32px 0",
          }}
          onClick={handleHome}
        >
          홈으로
        </button>
      </div>
    </div>
  );
}