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
      container: 'map-component',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [127.26442098, 36.501681024],
      zoom: 13
    });
    mapRef.current = map;

    // 지도 로드 완료 후 마커 추가
    map.on('load', () => {
      loadReports();
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
        if (report.lat && report.lng) {  // 모든 단계의 마커 표시
          // 좌표를 숫자로 변환하고 유효성 검사
          const lng = parseFloat(report.lng);
          const lat = parseFloat(report.lat);
          
          // 유효한 좌표인지 확인 (한국 지역 좌표 범위)
          if (!isNaN(lng) && !isNaN(lat) && 
              lng >= 124 && lng <= 132 && 
              lat >= 33 && lat <= 39) {
            
            console.log(`마커 생성: lng=${lng}, lat=${lat}, location=${report.location}`);
            
            // 마커 색상을 단계에 따라 다르게 설정
            let markerColor = '#ff4444'; // 기본 빨간색
            let markerTitle = `신고 위치: ${report.location || '위치 정보 없음'}`;
            
            if (report.ai_stage) {
              switch (report.ai_stage) {
                case 1:
                  markerColor = '#4CAF50'; // 초록색 - 출동 완료
                  markerTitle = `출동 완료: ${report.location || '위치 정보 없음'}`;
                  break;
                case 2:
                  markerColor = '#FF9800'; // 주황색 - 검토 중
                  markerTitle = `검토 중: ${report.location || '위치 정보 없음'}`;
                  break;
                case 3:
                  markerColor = '#ff4444'; // 빨간색 - 막힘 확인
                  markerTitle = `막힘 확인: ${report.location || '위치 정보 없음'}`;
                  break;
                case 4:
                  markerColor = '#9C27B0'; // 보라색 - 정상
                  markerTitle = `정상: ${report.location || '위치 정보 없음'}`;
                  break;
                case 5:
                  markerColor = '#607D8B'; // 회색 - 취소
                  markerTitle = `취소됨: ${report.location || '위치 정보 없음'}`;
                  break;
                default:
                  markerColor = '#ff4444';
              }
            }
            
            const el = document.createElement('div');
            el.className = 'report-marker';
            el.style.cssText = `
              background: ${markerColor};
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            `;
            el.title = markerTitle;
            
            const marker = new maplibregl.Marker({ 
              element: el, 
              anchor: 'bottom',
              pitchAlignment: 'map',
              rotationAlignment: 'map'
            })
              .setLngLat([lng, lat])  // [경도, 위도] 순서로 정확히 설정
              .addTo(mapRef.current);
              
            markerRefs.current.push(marker);
          } else {
            console.warn(`유효하지 않은 좌표: lng=${lng}, lat=${lat}, location=${report.location}`);
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
        <div id="map-component" style={{ width: '100%', height: '100%' }} ref={mapRef}></div>
      </div>
      <p>🗺️ 현재 클릭한 주소: <strong>{address}</strong></p>
    </div>
  );
};

export default MapComponent;