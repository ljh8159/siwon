import React from "react";
import { useHistory } from "react-router-dom";
import iconHome from "../assets/home.png";
import iconQR from "../assets/QR.png";
import iconUser from "../assets/user.png";

export default function Home({ reports = [], stats = { blocked_count: 0, dispatched_count: 0 } }) {
  const history = useHistory();
  const [showLegend, setShowLegend] = React.useState(false);

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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', margin: "24px 0 0 0" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>도로뚫이1단에<br />신고하세요</h2>
          
          {/* 범례 */}
          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '12px',
            minWidth: '120px',
            marginLeft: '10px'
          }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>범1례</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#ff4444',
                border: '2px solid white',
                marginRight: '6px'
              }}></div>
              <span>신고 위치</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ marginRight: '6px', fontSize: '10px' }}>🧹</span>
              <span>청소도구함</span>
            </div>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '6px' }}>
              마커 클릭 시 상세정보
            </div>
          </div>
        </div>
        {/* 지도는 별도 MapPage.js로 구현 */}
        <iframe src="/map" width="100%" height="315" style={{ border: "none", borderRadius: 16, display: 'block', verticalAlign: 'bottom' }} title="map" />
        {/* 안내문구 + 더보기 버튼 + 범례 토글 (지도 아래로만 남김) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 15,
          color: '#888',
          margin: '0 0 20px 5%'
        }}>
          <span>실시간 하수구 막힘 상황을 보여줍니다.</span>
          <span
            style={{ cursor: 'pointer', fontSize: 15, color: '#888', marginLeft: 12, marginRight: '5%' }}
            onClick={() => setShowLegend(v => !v)}
          >더보기</span>
        </div>
        {showLegend && (
          <div style={{ margin: '10px 0 10px 5%', fontSize: '0.95em' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 2 }}>침수등급:</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block', width: 18, height: 18, background: '#ffb3b3', marginRight: 3, border: '1px solid #333'
                }}></span> 1등급
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block', width: 18, height: 18, background: '#ffd699', marginRight: 3, border: '1px solid #333'
                }}></span> 2등급
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block', width: 18, height: 18, background: '#ffffb3', marginRight: 3, border: '1px solid #333'
                }}></span> 3등급
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block', width: 18, height: 18, background: '#b3ecff', marginRight: 3, border: '1px solid #333'
                }}></span> 4등급
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block', width: 18, height: 18, background: '#b3b3ff', marginRight: 3, border: '1px solid #333'
                }}></span> 5등급
              </span>
            </div>
          </div>
        )}
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