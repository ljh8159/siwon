import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/MapPage.module.css';
import proj4 from "proj4";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import config from '../config';

const API_URL = config.API_URL;

function geoJsonCoordsToLngLatArray(coords) {
  const epsg3857 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0 +y_0=0 +lon_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
  const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
  return coords[0].map(([x, y]) => {
    const [lng, lat] = proj4(epsg3857, wgs84, [x, y]);
    return [lng, lat];
  });
}

const MapPage = () => {
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const toolboxMarkerRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearMarkers = () => {
    markerRefs.current.forEach(marker => marker.remove());
    markerRefs.current = [];
  };

  const clearToolboxMarkers = () => {
    toolboxMarkerRefs.current.forEach(marker => marker.remove());
    toolboxMarkerRefs.current = [];
  };

  // DB 마커 표시
  const loadMarkers = async (map) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('API URL:', API_URL);
      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('신고 데이터 로드됨:', data);
      
      clearMarkers();
      
      if (data && Array.isArray(data)) {
        data.forEach((report, index) => {
          // 마커 위치 지정에는 parseFloat 사용(지도 API 요구)
          const lng = parseFloat(report.lng);
          const lat = parseFloat(report.lat);
          
          console.log(`마커 ${index + 1}: lat=${lat}, lng=${lng}, location=${report.location}, stage=${report.ai_stage}`);
          
          if (!isNaN(lng) && !isNaN(lat)) {
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
            
            // 마커 요소 생성
            const el = document.createElement('div');
            el.className = 'report-marker';
            el.style.background = markerColor;
            el.style.width = '16px';
            el.style.height = '16px';
            el.style.borderRadius = '50%';
            el.style.border = '3px solid white';
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            el.style.cursor = 'pointer';
            el.style.position = 'relative';
            el.title = markerTitle;
            
            // 마커 클릭 시 팝업 표시
            el.addEventListener('click', () => {
              // 기존 팝업 제거
              const existingPopup = document.querySelector('.maplibre-popup');
              if (existingPopup) {
                existingPopup.remove();
              }
              
              // 단계별 상태 텍스트
              let statusText = '신고';
              if (report.ai_stage) {
                switch (report.ai_stage) {
                  case 1: statusText = '출동 완료'; break;
                  case 2: statusText = '검토 중'; break;
                  case 3: statusText = '막힘 확인'; break;
                  case 4: statusText = '정상'; break;
                  case 5: statusText = '취소됨'; break;
                  default: statusText = '신고';
                }
              }
              
              // 새 팝업 생성
              const popup = new maplibregl.Popup({
                closeButton: true,
                closeOnClick: false,
                maxWidth: '300px'
              })
              .setLngLat([lng, lat])
              .setHTML(`
                <div style="padding: 10px;">
                  <h4 style="margin: 0 0 8px 0; color: #333;">🚨 ${statusText}</h4>
                  <p style="margin: 5px 0; font-size: 14px;"><strong>위치:</strong> ${report.location || '위치 정보 없음'}</p>
                  <p style="margin: 5px 0; font-size: 14px;"><strong>신고 시간:</strong> ${new Date(report.timestamp).toLocaleString('ko-KR')}</p>
                  <p style="margin: 5px 0; font-size: 12px; color: #666;">좌표: ${report.lat}, ${report.lng}</p>
                  ${report.ai_stage ? `<p style="margin: 5px 0; font-size: 12px; color: #666;">단계: ${report.ai_stage}</p>` : ''}
                </div>
              `);
              
              popup.addTo(map);
            });
            
            const marker = new maplibregl.Marker({ element: el })
              .setLngLat([lng, lat])
              .addTo(map);
            
            markerRefs.current.push(marker);
            console.log(`마커 ${index + 1} 추가됨 (색상: ${markerColor})`);
          } else {
            console.warn(`마커 ${index + 1}: 유효하지 않은 좌표 - lat=${lat}, lng=${lng}`);
          }
        });
      } else {
        console.warn('데이터가 배열이 아닙니다:', data);
      }
      
      console.log(`총 ${markerRefs.current.length}개의 신고 마커가 표시되었습니다.`);
      
    } catch (err) {
      console.error('마커 불러오기 실패:', err);
      setError(`신고 데이터를 불러오는데 실패했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // toolbox 마커 표시
  const loadToolboxMarkers = (map) => {
    fetch('/flood/toolbox_recommend.json')
      .then(res => res.json())
      .then(data => {
        clearToolboxMarkers();
        data.forEach(box => {
          const el = document.createElement('div');
          el.textContent = '🧹';
          el.style.fontSize = map.getZoom() * 2 + 8 + 'px';
          el.style.background = 'none';
          el.style.border = 'none';
          el.style.boxShadow = 'none';
          el.style.cursor = 'pointer';
          el.title = `청소도구함 추천 위치 (군집: ${box.cluster}, 개수: ${box.count})`;
          el.style.userSelect = 'none';
          el.style.pointerEvents = 'auto';
          el.style.lineHeight = '1';
          el.style.padding = '0';
          el.style.margin = '0';
          el.style.display = 'inline-block';
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([box.center_lon, box.center_lat])
            .addTo(map);
          toolboxMarkerRefs.current.push(marker);
        });
      })
      .catch(err => {
        console.error('toolbox 마커 불러오기 실패:', err);
      });
  };

  // 지도 생성 및 마커/레이어 로딩
  useEffect(() => {
    let map = new maplibregl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [128.35, 36.13],
      zoom: 13
    });
    mapRef.current = map;

    map.on('load', () => {
      // 침수흔적도 불러오기
      fetch('/flood/floodmap.json')
        .then(res => res.json())
        .then(data => {
          data.features.forEach(feature => {
            if (feature.geometry?.type === "Polygon") {
              feature.geometry.coordinates = [
                geoJsonCoordsToLngLatArray(feature.geometry.coordinates)
              ];
            }
          });

          map.addSource('flood', {
            type: 'geojson',
            data: data
          });

          map.addLayer({
            id: 'flood-layer',
            type: 'fill',
            source: 'flood',
            paint: {
              'fill-color': [
                'match',
                ['get', 'FLDN_GRD'],
                '1', '#ffb3b3',
                '2', '#ffd699',
                '3', '#ffffb3',
                '4', '#b3ecff',
                '5', '#b3b3ff',
                '#888888'
              ],
              'fill-opacity': 0.5,
              'fill-outline-color': '#333'
            }
          });
        });

      // DB에서 마커 불러오기 (최초 1회)
      loadMarkers(map);
      // toolbox 마커 불러오기 (최초 1회)
      loadToolboxMarkers(map);
    });

    return () => {
      if (map) map.remove();
      clearMarkers();
      clearToolboxMarkers();
    };
    // eslint-disable-next-line
  }, []);

  // zoom 이벤트에 따라 toolbox 마커 크기/표시 동적 제어
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handleZoom = () => {
      const zoom = map.getZoom();
      toolboxMarkerRefs.current.forEach(marker => {
        const el = marker.getElement();
        if (zoom < 9) {
          el.style.display = 'none';
        } else {
          el.style.display = 'inline-block';
          el.style.fontSize = zoom * 2 + 8 + 'px';
        }
      });
    };
    map.on('zoom', handleZoom);
    return () => {
      map.off('zoom', handleZoom);
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* 로딩 및 에러 상태 표시 */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          신고 데이터를 불러오는 중...
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,0,0,0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
      
      <div className={styles.mapArea}>
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>
      
      
    </div>
  );
};

export default MapPage;