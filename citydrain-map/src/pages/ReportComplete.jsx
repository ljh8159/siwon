import React from "react";
import { useHistory } from "react-router-dom";

function formatDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export default function ReportComplete({ photoUrl, location, completeTime, onNext }) {
  const history = useHistory();

  const handleHome = () => {
    if (onNext) onNext();
    else history.push("/");
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
          신고되었습니다!
        </h2>
        <div style={{ marginBottom: 32 }}>
          {photoUrl && (
            <img
              src={photoUrl}
              alt="업로드 사진"
              style={{
                width: 220,
                height: 160,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #eee",
                display: "block",
                margin: "0 auto",
              }}
            />
          )}
          <div style={{ marginTop: 8, textAlign: "center" }}>
            {/* 위치 정보가 있으면 사진 아래, 시간 위에 표시 */}
            {location && (
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
                {location}
              </div>
            )}
            {completeTime && (
              <div style={{ color: "#888", fontSize: 13 }}>
                {formatDateTime(completeTime)}
              </div>
            )}
          </div>
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