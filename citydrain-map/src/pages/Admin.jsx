import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'https://backendflask-production-f4c6.up.railway.app';

export default function Admin() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin_reports`);
      setReports(res.data);
    } catch (e) {
      setReports([]);
    }
  };

  // 승인/취소 버튼 클릭 핸들러
  const handleApprove = async (id) => {
    try {
      await axios.post(`${API_URL}/api/admin_approve`, {
        id,
        ai_stage: 3,
      });
      fetchReports();
    } catch (e) {
      alert("승인 처리 실패");
    }
  };
  const handleReject = async (id) => {
    try {
      await axios.post(`${API_URL}/api/admin_approve`, {
        id,
        ai_stage: 5,
      });
      fetchReports();
    } catch (e) {
      alert("취소 처리 실패");
    }
  };

  // 검색/날짜 필터링은 프론트에서 간단히 구현 (실제 DB 필터는 추후 확장)
  const filteredReports = reports.filter(
    (r) =>
      (!search || r.location.includes(search))
    // 날짜 필터는 필요시 추가
  );

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
        margin: "0 auto",
      }}
    >
      <div
        className="container"
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          padding: "32px 24px 0 24px",
          overflowY: "auto",
          borderRadius: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 0 16px 0",
          }}
        >
          <button
            style={{
              fontSize: 20,
              marginRight: 16,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => window.history.back()}
          >
            &lt;
          </button>
          <h2
            style={{
              flex: 1,
              textAlign: "center",
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            관리자(2단계)
          </h2>
          <div style={{ width: 36 }}></div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "0 0 16px 0",
          }}
        >
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              flex: "0 0 120px",
              fontSize: 16,
              padding: 4,
            }}
          />
          <input
            type="text"
            placeholder="검색 예: 서울"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              fontSize: 16,
              padding: 4,
            }}
          />
        </div>
        <div
          style={{
            background: "#f7f7f7",
            borderRadius: 12,
            margin: "0 0 16px 0",
            padding: 8,
          }}
        >
          {filteredReports.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#aaa",
                padding: 32,
              }}
            >
              목록이 없습니다.
            </div>
          ) : (
            filteredReports.map((r, i) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i !== filteredReports.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    marginRight: 12,
                  }}
                >
                  🚧
                </span>
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    신고
                  </div>
                  <div
                    style={{
                      color: "#888",
                      fontSize: 15,
                    }}
                  >
                    {r.location}
                  </div>
                </div>
                <div
                  style={{
                    color: "#888",
                    fontSize: 15,
                    minWidth: 50,
                    textAlign: "right",
                    marginRight: 8,
                  }}
                >
                  {r.time}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button
                    style={{
                      background: "#4b53e5",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 13,
                      marginBottom: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => handleApprove(r.id)}
                  >
                    승인
                  </button>
                  <button
                    style={{
                      background: "#eee",
                      color: "#444",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                    onClick={() => handleReject(r.id)}
                  >
                    취소
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}