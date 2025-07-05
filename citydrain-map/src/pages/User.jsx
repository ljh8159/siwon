import React from "react";
import { useHistory } from "react-router-dom";
import iconHome from "../assets/home.png";
import iconQR from "../assets/QR.png";
import iconUser from "../assets/user.png";

export default function User({ user = {}, onLogout }) {
  const history = useHistory();

  // 하단바 버튼 핸들러
  const goHome = () => history.push("/");
  const goReport = () => history.push("/qr_start");
  const goUser = () => {}; // 현재 페이지

  // 로그아웃 버튼 클릭 시: 로그아웃 처리 후 로그인 화면으로 이동
  const handleLogout = () => {
    if (onLogout) onLogout();
    history.replace("/login");
  };

  // 관리자 페이지 이동
  const goAdmin = () => {
    history.push("/admin");
  };

  // 서비스 이용 이력 예시 (user.reports 배열)
  const reports = user.reports || [];

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
        <h2 style={{ margin: "0 0 24px 0", fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 }}>
          내 정보
        </h2>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
          <img
            src={user?.avatar || iconUser}
            alt="프로필"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              marginRight: 20,
              border: "2px solid #eee",
            }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: 18 }}>{user?.name || "비회원"}</div>
            <div style={{ fontSize: 14, color: "#888" }}>{user?.email || ""}</div>
          </div>
        </div>
        {/* 포인트 */}
        <div
          style={{
            background: "#f5f7ff",
            borderRadius: 12,
            padding: "12px 0",
            textAlign: "center",
            marginBottom: 18,
            border: "1px solid #e0e4ff",
            fontWeight: 600,
            fontSize: 17,
            color: "#4b53e5",
          }}
        >
          포인트 <span style={{ fontWeight: 700, fontSize: 22 }}>{user?.point ?? 0}</span> P
        </div>
        {/* 신고건수/출동건수 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            background: "#fafafa",
            borderRadius: 12,
            padding: "18px 0",
            border: "1px solid #eee",
          }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>신고건수</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{user?.reportCount ?? 0}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>출동건수</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{user?.dispatchCount ?? 0}</div>
          </div>
        </div>
        {/* 서비스 이용 이력 */}
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, marginTop: 8 }}>
          서비스 이용 이력
          <span
            style={{ float: "right", fontSize: 22, cursor: "pointer" }}
            onClick={() => history.push("/user/history")}
          >+</span>
        </div>
        <div style={{ background: "#f7f8fa", borderRadius: 12, padding: 12 }}>
          {reports.length === 0 ? (
            <div style={{ color: "#aaa", textAlign: "center", padding: 16 }}>이용 이력이 없습니다.</div>
          ) : (
            reports.map((r, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                borderBottom: i !== reports.length - 1 ? "1px solid #eee" : "none",
                padding: "10px 0"
              }}>
                <span style={{ fontSize: 22, marginRight: 10 }}>
                  {r.type === "출동" ? "🚓" : "🚧"}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.type}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>{r.location}</div>
                </div>
                <div style={{ fontSize: 13, color: "#888", marginLeft: 8, whiteSpace: "nowrap" }}>{r.time}</div>
              </div>
            ))
          )}
        </div>
        {/* 안내 문구 */}
        <div style={{
          marginTop: 24,
          color: "#888",
          fontSize: 14,
          textAlign: "center",
          lineHeight: 1.6
        }}>
          신고/출동을 많이 할수록 포인트가 쌓여요.<br />
          포인트는 다양한 혜택으로 교환할 수 있습니다.
        </div>
        {/* 관리자 버튼 */}
        <button
          type="button"
          style={{
            width: 80,
            padding: "4px 0",
            background: "#eee",
            color: "#555",
            fontSize: 13,
            fontWeight: 500,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            margin: "16px 0 0 0",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto"
          }}
          onClick={goAdmin}
        >
          관리자
        </button>
        <button
          type="button"
          style={{
            width: "100%",
            padding: "14px 0",
            background: "#aab3ff",
            color: "#fff",
            fontSize: 18,
            fontWeight: 500,
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            margin: "16px 0 16px 0",
          }}
          onClick={handleLogout}
        >
          로그아웃
        </button>
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
            color: "#888",
            fontSize: 12,
            cursor: "pointer",
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
            color: "#4b53e5",
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          <img src={iconUser} alt="사용자" style={{ width: 32, height: 32, marginBottom: 2 }} />
          사용자
        </button>
      </div>
    </div>
  );
}

