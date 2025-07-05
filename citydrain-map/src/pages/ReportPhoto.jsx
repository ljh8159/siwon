import React, { useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import config from '../config';

const API_URL = config.API_URL;

export default function ReportPhoto({ onSubmit, lat, lng }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", localStorage.getItem("user_id") || "guest");
      
      const res = await fetch(`${API_URL}/api/upload_photo`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '파일 업로드에 실패했습니다.');
      }

      const data = await res.json();
      if (data.filename && onSubmit) {
        onSubmit(data.filename, lat, lng);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || '파일 업로드에 실패했습니다.');
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
          신고 사진 업로드
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="photo-upload" style={{ marginBottom: 32 }}>
            <label
              className="upload-label"
              htmlFor="photo-input"
              style={{
                display: "inline-block",
                width: 80,
                height: 80,
                background: "#222",
                borderRadius: "50%",
                textAlign: "center",
                lineHeight: "80px",
                color: "#fff",
                fontSize: 32,
                cursor: "pointer",
                marginBottom: 8,
              }}
            >
              <span role="img" aria-label="camera">
                &#128247;
              </span>
            </label>
            <input
              className="file-input"
              id="photo-input"
              type="file"
              accept="image/*"
              required
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <button
            className="btn"
            type="submit"
            style={{
              width: 220,
              padding: "16px 0",
              background: "#aab3ff",
              color: "#fff",
              fontSize: 18,
              fontWeight: 500,
              border: "none",
              borderRadius: 12,
              cursor: file ? "pointer" : "not-allowed",
            }}
            disabled={!file}
          >
            사진 업로드
          </button>
        </form>
      </div>
    </div>
  );
}