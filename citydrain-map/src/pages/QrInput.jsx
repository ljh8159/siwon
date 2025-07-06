import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

export default function QrInput({ onSubmit }) {
  const [qrType, setQrType] = useState(""); // "report" 또는 "dispatch"
  const [inputValue, setInputValue] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [qrError, setQrError] = useState("");
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef(null);
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

  // QR 코드 이미지 파일 업로드 핸들러
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setQrError("");
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageDataUrl = event.target.result;
      try {
        const html5Qr = new Html5Qrcode("qr-reader-temp");
        const result = await html5Qr.scanFile(file, true);
        handleQrResult(result);
        html5Qr.clear();
      } catch (err) {
        setQrError("QR 코드 인식에 실패했습니다. 다른 이미지를 시도해보세요.");
      }
    };
    reader.readAsDataURL(file);
  };

  // 카메라로 QR 코드 스캔
  const handleCameraScan = async () => {
    setQrError("");
    setScanning(true);
    const html5Qr = new Html5Qrcode("qr-reader");
    html5Qr.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        handleQrResult(decodedText);
        html5Qr.stop();
        setScanning(false);
      },
      (errorMessage) => {
        // 인식 실패시 무시
      }
    ).catch((err) => {
      setQrError("카메라 접근에 실패했습니다.");
      setScanning(false);
    });
  };

  // QR 코드 결과 파싱 및 입력
  const handleQrResult = (result) => {
    // 예시: "36.501681024,127.26442098, 세종특별자치시 어진동 575"
    const parts = result.split(",");
    if (parts.length >= 3) {
      setLat(parts[0].trim());
      setLng(parts[1].trim());
      setInputValue(parts.slice(2).join(",").trim());
      setQrError("");
    } else {
      setQrError("QR 코드 데이터 형식이 올바르지 않습니다.");
    }
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
        {/* QR 코드 인식 UI */}
        <div style={{ marginBottom: 16, width: "100%" }}>
          <button
            type="button"
            onClick={handleCameraScan}
            style={{
              width: "100%",
              padding: "12px 0",
              background: "#4b53e5",
              color: "#fff",
              fontSize: 16,
              border: "none",
              borderRadius: 8,
              marginBottom: 8,
              cursor: scanning ? "not-allowed" : "pointer",
              opacity: scanning ? 0.6 : 1,
            }}
            disabled={scanning}
          >
            {scanning ? "카메라 스캔 중..." : "카메라로 QR 코드 스캔"}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              width: "100%",
              padding: "12px 0",
              background: "#aab3ff",
              color: "#fff",
              fontSize: 16,
              border: "none",
              borderRadius: 8,
              marginBottom: 8,
              cursor: "pointer",
            }}
          >
            갤러리에서 QR 코드 이미지 선택
          </button>
          {qrError && (
            <div style={{ color: "red", fontSize: 14, marginTop: 8 }}>{qrError}</div>
          )}
          {/* 카메라 스캔 영역 */}
          <div id="qr-reader" style={{ width: 280, height: scanning ? 280 : 0, margin: "0 auto", transition: "height 0.3s" }} />
          {/* 파일 스캔용 임시 div (화면에는 안보임) */}
          <div id="qr-reader-temp" style={{ display: "none" }} />
        </div>
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
            placeholder="위치(주소)"
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
              background: "#f5f5f5",
            }}
            readOnly
            required
          />
          <input
            type="number"
            step="any"
            placeholder="위도(lat)"
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
              background: "#f5f5f5",
            }}
            readOnly
            required
          />
          <input
            type="number"
            step="any"
            placeholder="경도(lng)"
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
              background: "#f5f5f5",
            }}
            readOnly
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