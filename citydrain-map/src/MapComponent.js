// MapComponent.js
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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

    // 지도 로드 완료 후 마커 추가
    map.on('load', () => {
      loadReports();
    });

    // 지도 확대/축소 시 마커 위치 재확인
    map.on('zoomend', () => {
      markerRefs.current.forEach(marker => {
        const el = marker.getElement();
        if (el) {
          const transform = el.style.transform;
          if (!transform || transform === 'none') {
            const lngLat = marker.getLngLat();
            marker.setLngLat(lngLat);
          }
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
      el.style.cssText = `
        background: #4b53e5;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      el.title = '신고 위치';
      const marker = new maplibregl.Marker({ 
        element: el, 
        anchor: 'bottom',
        pitchAlignment: 'map',
        rotationAlignment: 'map'
      })
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

  // DB에서 reports 로드하는 함수
  const loadReports = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reports`);
      const data = await response.json();
      
      // 기존 마커들 제거
      markerRefs.current.forEach(marker => marker.remove());
      markerRefs.current = [];
      
      data.forEach(report => {
        if (report.ai_stage === 3 && report.lat && report.lng) {
          // 좌표를 숫자로 변환하고 유효성 검사
          const lng = parseFloat(report.lng);
          const lat = parseFloat(report.lat);
          
          // 유효한 좌표인지 확인
          if (!isNaN(lng) && !isNaN(lat) && 
              lng >= -180 && lng <= 180 && 
              lat >= -90 && lat <= 90) {
            
            const el = document.createElement('div');
            el.className = 'report-marker';
            el.style.cssText = `
              background: #ff4444;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            `;
            el.title = report.location || '';
            
            const marker = new maplibregl.Marker({ 
              element: el, 
              anchor: 'bottom',
              pitchAlignment: 'map',
              rotationAlignment: 'map'
            })
              .setLngLat([lng, lat])
              .addTo(mapRef.current);
              
            markerRefs.current.push(marker);
          }
        }
      });
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

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