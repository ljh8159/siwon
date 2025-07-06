import React, { useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import config from '../config';

const API_URL = config.API_URL;

export default function DispatchPhotoUpload({ onSubmit }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCapturedImage(null);
      setShowPreview(true);
    }
  };

  const handleCameraCapture = (e) => {
    const capturedFile = e.target.files[0];
    if (capturedFile) {
      setFile(capturedFile);
      setCapturedImage(URL.createObjectURL(capturedFile));
      setShowPreview(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    // 파일 업로드 API 호출
    const formData = new FormData();
    formData.append("file", file);
    // user_id를 반드시 추가
    formData.append("user_id", localStorage.getItem("user_id"));
    const res = await fetch(`${API_URL}/api/upload_photo`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.filename && onSubmit) {
      onSubmit(data.filename); // 다음 단계로 파일명 전달
    }
  };

  const handleRetake = () => {
    setFile(null);
    setCapturedImage(null);
    setShowPreview(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
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
          출동 사진 촬영/업로드
        </h2>
        
        {!showPreview ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="photo-options" style={{ marginBottom: 32, textAlign: "center" }}>
              {/* 카메라 촬영 버튼 */}
              <div style={{ marginBottom: 24 }}>
                <label
                  className="camera-label"
                  htmlFor="camera-input"
                  style={{
                    display: "inline-block",
                    width: 120,
                    height: 120,
                    background: "#4CAF50",
                    borderRadius: "50%",
                    textAlign: "center",
                    lineHeight: "120px",
                    color: "#fff",
                    fontSize: 48,
                    cursor: "pointer",
                    marginBottom: 12,
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                  }}
                >
                  <span role="img" aria-label="camera">
                    📷
                  </span>
                </label>
                <input
                  className="camera-input"
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={cameraInputRef}
                  style={{ display: "none" }}
                  onChange={handleCameraCapture}
                />
                <div style={{ fontSize: 16, color: "#666", fontWeight: 500 }}>
                  카메라로 촬영
                </div>
              </div>

              {/* 구분선 */}
              <div style={{ 
                width: "80%", 
                height: 1, 
                background: "#eee", 
                margin: "24px auto",
                position: "relative"
              }}>
                <span style={{
                  position: "absolute",
                  top: "-8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#fff",
                  padding: "0 12px",
                  color: "#999",
                  fontSize: 12
                }}>
                  또는
                </span>
              </div>

              {/* 갤러리에서 선택 버튼 */}
              <div>
                <label
                  className="upload-label"
                  htmlFor="photo-input"
                  style={{
                    display: "inline-block",
                    width: 120,
                    height: 120,
                    background: "#2196F3",
                    borderRadius: "50%",
                    textAlign: "center",
                    lineHeight: "120px",
                    color: "#fff",
                    fontSize: 48,
                    cursor: "pointer",
                    marginBottom: 12,
                    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
                  }}
                >
                  <span role="img" aria-label="gallery">
                    🖼️
                  </span>
                </label>
                <input
                  className="file-input"
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <div style={{ fontSize: 16, color: "#666", fontWeight: 500 }}>
                  갤러리에서 선택
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="preview-container" style={{ width: "100%", textAlign: "center" }}>
            <div style={{ marginBottom: 24 }}>
              <img
                src={capturedImage || (file ? URL.createObjectURL(file) : '')}
                alt="촬영된 사진"
                style={{
                  width: 280,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "2px solid #eee",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
              <button
                type="button"
                onClick={handleRetake}
                style={{
                  padding: "12px 24px",
                  background: "#f44336",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 500,
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                다시 촬영
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  padding: "12px 24px",
                  background: "#4CAF50",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 500,
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                업로드
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}