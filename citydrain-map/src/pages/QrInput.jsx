import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function QrInput({ onSubmit }) {
  const [qrType, setQrType] = useState(""); // "report" 또는 "dispatch"
  const [inputValue, setInputValue] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const history = useHistory();

  const handleTypeChange = (e) => {
    setQrType(e.target.value);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleLatChange = (e) => {
    setLat(e.target.value);
  };

  const handleLngChange = (e) => {
    setLng(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!qrType) return;
    // 좌표값이 없으면 null로 전달
    const latValue = lat ? parseFloat(lat) : null;
    const lngValue = lng ? parseFloat(lng) : null;
    // for_userpage_type: '신고' 또는 '출동' (qrType이 report면 '신고', dispatch면 '출동')
    const for_userpage_type = qrType === "report" ? "신고" : "출동";
    if (onSubmit) {
      onSubmit({
        qrType,
        inputValue,
        lat: latValue,
        lng: lngValue,
        for_userpage_type, // 추가
      });
    }
    if (qrType === "report") {
      history.push("/report/photo", { lat: latValue, lng: lngValue, for_userpage_type });
    } else if (qrType === "dispatch") {
      history.push("/dispatch/start", { lat: latValue, lng: lngValue, for_userpage_type });
    }
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
          QR 코드 입력
        </h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 16, color: "#555", marginRight: 12 }}>
              <input
                type="radio"
                name="qrType"
                value="report"
                checked={qrType === "report"}
                onChange={handleTypeChange}
                style={{ marginRight: 6 }}
              />
              신고
            </label>
            <label style={{ fontSize: 16, color: "#555", marginLeft: 24 }}>
              <input
                type="radio"
                name="qrType"
                value="dispatch"
                checked={qrType === "dispatch"}
                onChange={handleTypeChange}
                style={{ marginRight: 6 }}
              />
              출동
            </label>
          </div>
          <input
            type="text"
            placeholder="위치를 입력하세요"
            value={inputValue}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "14px 12px",
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 8,
              marginBottom: 16,
              boxSizing: "border-box",
            }}
            required
          />
          <input
            type="number"
            step="any"
            placeholder="위도(lat)를 입력하세요"
            value={lat}
            onChange={handleLatChange}
            style={{
              width: "100%",
              padding: "14px 12px",
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 8,
              marginBottom: 12,
              boxSizing: "border-box",
            }}
            required
          />
          <input
            type="number"
            step="any"
            placeholder="경도(lng)를 입력하세요"
            value={lng}
            onChange={handleLngChange}
            style={{
              width: "100%",
              padding: "14px 12px",
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 8,
              marginBottom: 24,
              boxSizing: "border-box",
            }}
            required
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px 0",
              background: "#aab3ff",
              color: "#fff",
              fontSize: 18,
              fontWeight: 500,
              border: "none",
              borderRadius: 12,
              cursor: qrType ? "pointer" : "not-allowed",
            }}
            disabled={!qrType}
          >
            다음
          </button>
        </form>
      </div>
    </div>
  );
}