// MapComponent.js
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

const API_URL = process.env.REACT_APP_API_URL || 'https://backendflask-production-f4c6.up.railway.app';

const MapComponent = () => {
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [clickedMarker, setClickedMarker] = useState(null);

  // 지도 및 DB 마커 로딩
  useEffect(() => {
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [127.26442098, 36.501681024],
      zoom: 13
    });
    mapRef.current = map;

    // DB 마커 불러오기
    fetch(`${API_URL}/api/reports`)
      .then(res => res.json())
      .then(data => {
        markerRefs.current.forEach(marker => marker.remove());
        markerRefs.current = [];
        data.forEach(report => {
          if (report.ai_stage === 3 && report.lat && report.lng) {
            const lng = Number(report.lng);
            const lat = Number(report.lat);
            const el = document.createElement('div');
            el.className = 'report-marker';
            el.style.background = '#ff4444';
            el.style.width = '16px';
            el.style.height = '16px';
            el.style.borderRadius = '50%';
            el.style.border = '3px solid white';
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            el.style.cursor = 'pointer';
            el.title = report.location || '';
            const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
              .setLngLat([lng, lat])
              .addTo(map);
            markerRefs.current.push(marker);
          }
        });
      });

    // 지도 클릭 시 마커 추가
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      // 기존 클릭 마커 제거
      if (clickedMarker) {
        clickedMarker.remove();
      }
      // 새 마커 생성
      const el = document.createElement('div');
      el.className = 'report-marker';
      el.style.background = '#4b53e5';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.title = '신고 위치';
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map);
      setClickedMarker(marker);
      // 주소 변환(예시: reverse geocoding API 필요)
      setAddress(`위도: ${lat}, 경도: ${lng}`);
    });

    return () => {
      if (map) map.remove();
      markerRefs.current.forEach(marker => marker.remove());
      if (clickedMarker) clickedMarker.remove();
    };
  }, []);

  return (
    <div>
      <h2>📍 도로뚫이단 - 하수구 지도</h2>
      <label>
        사진 업로드:&nbsp;
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
      </label>
      <div style={{ width: '100%', height: '500px' }}>
        <div id="map" style={{ width: '100%', height: '100%' }} ref={mapRef}></div>
      </div>
      <p>🗺️ 현재 클릭한 주소: <strong>{address}</strong></p>
    </div>
  );
};

export default MapComponent;