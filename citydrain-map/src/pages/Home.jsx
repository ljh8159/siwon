import React from "react";
import { useHistory } from "react-router-dom";
import iconHome from "../assets/home.png";
import iconQR from "../assets/QR.png";
import iconUser from "../assets/user.png";

export default function Home({ reports = [], stats = { blocked_count: 0, dispatched_count: 0 } }) {
  const history = useHistory();

  const handleMoreReports = () => {
    history.push("/home/history");
  };

  // 하단바 버튼 핸들러
  const goHome = () => history.push("/");
  const goReport = () => history.push("/qr_start");
  const goUser = () => history.push("/user");

  return (
    <div className="iphone-frame" style={{
      width: 393, height: 852, background: "#fff", borderRadius: 32,
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden"
    }}>
      <div className="container" style={{
        width: "100%", height: "100%", boxSizing: "border-box", paddingBottom: 80, overflowY: "auto", borderRadius: 32
      }}>
        <h2 style={{ margin: "24px 0 0 0", fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 }}>도로뚫이단에<br />신고하세요</h2>
        {/* 지도는 별도 MapPage.js로 구현 */}
        <iframe src="/map" width="100%" height="340" style={{ border: "none", borderRadius: 16 }} title="map" />
        <div style={{ fontSize: 15, color: "#888", margin: "8px 0 20px 5%" }}>실시간 하수구 막힘 상황을 보여줍니다.</div>
        <div style={{ padding: "0 5%" }}>
          <b style={{ fontSize: 18 }}>신고 목록</b>
          <span
            className="more-btn"
            style={{ float: "right", fontSize: 24, cursor: "pointer" }}
            onClick={handleMoreReports}
          >+</span>
        </div>
        <div className="report-list">
          {reports.length === 0 ? (
            <div style={{ color: "#aaa", textAlign: "center", padding: 16 }}>신고/출동 이력이 없습니다.</div>
          ) : (
            reports.map((r, i) => (
              <div className="report-item" key={i} style={{ display: "flex", alignItems: "center", padding: "16px 5%", borderBottom: "1px solid #eee" }}>
                <span className="report-icon" style={{ width: 36, height: 36, marginRight: 12, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {r.type === "출동" ? "🚓" : "🚧"}
                </span>
                <div className="report-info" style={{ flex: 1 }}>
                  <div className="report-status" style={{ fontWeight: "bold", fontSize: 16 }}>{r.type}</div>
                  <div className="report-address" style={{ fontSize: 13, color: "#888" }}>{r.location}</div>
                </div>
                <div className="report-time" style={{ fontSize: 13, color: "#888", marginLeft: 8, whiteSpace: "nowrap" }}>{r.time}</div>
              </div>
            ))
          )}
        </div>
        <div style={{ fontWeight: "bold", margin: "24px 0 8px 5%" }}>하수구 상태</div>
        <div className="status-box" style={{ display: "flex", gap: 8, margin: "24px 0 0 0", padding: "0 5%" }}>
          <div className="status-card" style={{ flex: 1, background: "#fafafa", borderRadius: 8, padding: "16px 0", textAlign: "center", border: "1px solid #eee" }}>
            <div style={{ fontSize: 13, color: "#888" }}>신고된 막힌 하수구 수</div>
            <div style={{ fontSize: 22, fontWeight: "bold" }}>{stats.blocked_count}</div>
          </div>
          <div className="status-card" style={{ flex: 1, background: "#fafafa", borderRadius: 8, padding: "16px 0", textAlign: "center", border: "1px solid #eee" }}>
            <div style={{ fontSize: 13, color: "#888" }}>출동 완료</div>
            <div style={{ fontSize: 22, fontWeight: "bold" }}>{stats.dispatched_count}</div>
          </div>
        </div>
      </div>
      {/* 하단바 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 64,
          background: "#fff",
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <button
          onClick={goHome}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#4b53e5",
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          <img src={iconHome} alt="홈" style={{ width: 32, height: 32, marginBottom: 2 }} />
          홈
        </button>
        <button
          onClick={goReport}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#888",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <img src={iconQR} alt="신고/출동QR" style={{ width: 32, height: 32, marginBottom: 2 }} />
          신고/출동QR
        </button>
        <button
          onClick={goUser}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#888",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <img src={iconUser} alt="사용자" style={{ width: 32, height: 32, marginBottom: 2 }} />
          사용자
        </button>
      </div>
    </div>
  );
}