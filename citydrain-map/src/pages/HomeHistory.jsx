import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function HomeHistory({ reports = [] }) {
  const history = useHistory();
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  // 날짜/검색 필터링
  const filteredReports = reports.filter(r => {
    let ok = true;
    if (date && r.timestamp) {
      ok = ok && r.timestamp.startsWith(date);
    }
    if (search) {
      ok = ok && (
        (r.location && r.location.includes(search)) ||
        (r.type && r.type.includes(search))
      );
    }
    return ok;
  });

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
          padding: "32px 0 80px 0",
          overflowY: "auto",
          borderRadius: 32,
        }}
      >
        {/* 상단 뒤로가기 */}
        <button
          onClick={() => history.push("/")}
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
        <h2 style={{ margin: "0 0 24px 0", fontSize: "1.5rem", fontWeight: 700, textAlign: "center" }}>
          신고 목록
        </h2>
        {/* 날짜/검색 */}
        <div style={{ display: "flex", alignItems: "center", margin: "0 24px 16px 24px", gap: 8 }}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              flex: "0 0 120px",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "6px 8px",
              fontSize: 15,
              background: "#fafafa"
            }}
          />
          <input
            type="text"
            placeholder="검색 예: 서울"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "6px 8px",
              fontSize: 15,
              background: "#fafafa"
            }}
          />
        </div>
        {/* 전체 이력 리스트 */}
        <div style={{
          margin: "0 16px",
          background: "#f7f8fa",
          borderRadius: 12,
          padding: 8,
          minHeight: 300
        }}>
          {filteredReports.length === 0 ? (
            <div style={{ color: "#aaa", textAlign: "center", padding: 16 }}>신고/출동 이력이 없습니다.</div>
          ) : (
            filteredReports.map((r, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                borderBottom: i !== filteredReports.length - 1 ? "1px solid #eee" : "none",
                padding: "12px 0"
              }}>
                <span style={{ fontSize: 22, marginRight: 10 }}>
                  {r.type === "출동" ? "🚓" : "🚧"}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.type}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>{r.location}</div>
                </div>
                <div style={{ fontSize: 13, color: "#888", marginLeft: 8, whiteSpace: "nowrap" }}>
                  {r.time}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}