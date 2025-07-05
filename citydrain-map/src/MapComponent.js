// MapComponent.js
import React, { useEffect, useRef, useState } from 'react';

const KAKAO_MAP_KEY = "YOUR_KAKAO_MAP_KEY"; // 실제 키로 교체
const API_URL = process.env.REACT_APP_API_URL || 'https://backendflask-production-f4c6.up.railway.app';

function loadKakaoMapScript(callback) {
  if (window.kakao && window.kakao.maps) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;
  script.onload = () => {
    window.kakao.maps.load(callback);
  };
  document.head.appendChild(script);
}

const MapComponent = () => {
  const mapRef = useRef(null);
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const markersRef = useRef([]);

  useEffect(() => {
    loadKakaoMapScript(() => {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(36.501681024, 127.26442098),
        level: 7,
      };
      const map = new window.kakao.maps.Map(container, options);

      // 마커 불러오기
      fetch(`${API_URL}/api/reports`)
        .then((res) => res.json())
        .then((data) => {
          // 기존 마커 삭제
          markersRef.current.forEach((marker) => marker.setMap(null));
          markersRef.current = [];
          data.forEach((report) => {
            if (report.ai_stage === 3 && report.lat && report.lng) {
              const markerPosition = new window.kakao.maps.LatLng(report.lat, report.lng);
              const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                map: map,
              });
              markersRef.current.push(marker);
            }
          });
        });

      // 지도 클릭 시 신고
      window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
        const latlng = mouseEvent.latLng;
        // 주소 변환
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function (result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            const addr = result[0].address.address_name;
            setAddress(addr);

            // 사진 업로드가 선택되지 않은 경우 안내
            if (!image) {
              alert("사진을 먼저 업로드 해주세요!");
              return;
            }

            // 신고 전송 (FormData 사용)
            const timestamp = new Date().toISOString();
            const formData = new FormData();
            formData.append('lat', latlng.getLat());
            formData.append('lng', latlng.getLng());
            formData.append('address', addr);
            formData.append('timestamp', timestamp);
            formData.append('image', image);

            fetch(`${API_URL}/report`, {
              method: 'POST',
              body: formData
            })
              .then(res => res.json())
              .then(data => {
                alert(data.message);
                // 3단계일 때만 마커 추가
                if (data.status === "accept") {
                  const marker = new window.kakao.maps.Marker({
                    position: latlng,
                    map: map
                  });
                  markersRef.current.push(marker);
                }
                // 4단계면 공공기관 사이트로 이동
                if (data.status === "redirect") {
                  window.open("https://www.safekorea.go.kr/", "_blank");
                }
              });
          }
        });
      });
    });
    // eslint-disable-next-line
  }, [image]);

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