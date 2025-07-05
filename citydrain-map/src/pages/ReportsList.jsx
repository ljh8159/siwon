import React from "react";
import { useHistory } from "react-router-dom";

export default function ReportsList({ reports = [] }) {
  const history = useHistory();

  const goHome = () => history.push("/");

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
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="container"
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          padding: "32px 24px 80px 24px",
          overflowY: "auto",
          borderRadius: 32,
        }}
      >
        {/* 좌측 상단 '<(뒤로가기)' 버튼 */}
        <button
          onClick={goHome}
          style={{
            position: "absolute",
            top: 24,
            left: 16,
            background: "none",
            border: "none",
            fontSize: 28,
            color: "#333",
            cursor: "pointer",
            fontWeight: 700,
            zIndex: 2,
          }}
          aria-label="뒤로가기"
        >
          &lt;
        </button>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "2rem", fontWeight: 700, lineHeight: 1.2, textAlign: "center" }}>
          신고/출동 목록
        </h2>
        <div className="report-list">
          {reports.length === 0 ? (
            <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
              신고/출동 내역이 없습니다.
            </div>
          ) : (
            reports.map((r, i) => (
              <div
                className="report-item"
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span
                  className="report-icon"
                  style={{
                    width: 36,
                    height: 36,
                    marginRight: 12,
                    fontSize: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {r.type === "출동" ? "🚓" : "🚧"}
                </span>
                <div className="report-info" style={{ flex: 1 }}>
                  <div className="report-status" style={{ fontWeight: "bold", fontSize: 16 }}>
                    {r.type} ({r.stage}단계)
                  </div>
                  <div className="report-address" style={{ fontSize: 13, color: "#888" }}>
                    {r.location}
                  </div>
                  <div className="report-time" style={{ fontSize: 13, color: "#888" }}>
                    {r.time}
                  </div>
                  <div className="report-user" style={{ fontSize: 13, color: "#aaa" }}>
                    {r.user}
                  </div>
                </div>
                {r.image && (
                  <img
                    src={r.image}
                    alt="신고이미지"
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginLeft: 8,
                      border: "1px solid #eee",
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}