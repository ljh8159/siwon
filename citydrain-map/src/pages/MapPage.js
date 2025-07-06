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
      
      // 기존 마커들 완전히 제거
      clearMarkers();
      
      if (data && Array.isArray(data)) {
        // 유효한 데이터만 필터링
        const validReports = data.filter(report => {
          const lng = parseFloat(report.lng);
          const lat = parseFloat(report.lat);
          return !isNaN(lng) && !isNaN(lat) && 
                 lng >= 124 && lng <= 132 && 
                 lat >= 33 && lat <= 39;
        });
        
        console.log(`유효한 신고 데이터: ${validReports.length}개`);
        
        // 마커 생성을 순차적으로 처리하여 안정성 향상
        for (let index = 0; index < validReports.length; index++) {
          const report = validReports[index];
          
          // 좌표를 숫자로 변환
          const lng = parseFloat(report.lng);
          const lat = parseFloat(report.lat);
          
          console.log(`=== 마커 ${index + 1} 생성 시작 ===`);
          console.log(`원본 데이터: lng=${report.lng}, lat=${report.lat}`);
          console.log(`변환된 좌표: lng=${lng}, lat=${lat}`);
          console.log(`위치: ${report.location}, 단계: ${report.ai_stage}`);
          
          // 각 마커마다 고유한 ID 생성
          const markerId = `marker-${report.id || index}`;
          
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
          
          // 마커 요소 생성 - 고유한 ID 부여
          const el = document.createElement('div');
          el.className = 'report-marker';
          el.id = markerId;
          el.style.cssText = `
            background: ${markerColor};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            position: absolute;
            z-index: 1;
            pointer-events: auto;
          `;
          el.title = markerTitle;
          
          // 마커 클릭 시 팝업 표시
          el.addEventListener('click', () => {
            // 기존 팝업 제거
            const existingPopup = document.querySelector('.maplibregl-popup');
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
              maxWidth: '300px',
              className: 'custom-popup'
            })
            .setLngLat([lng, lat])
            .setHTML(`
              <div style="padding: 10px;">
                <h4 style="margin: 0 0 8px 0; color: #333;">🚨 ${statusText}</h4>
                <p style="margin: 5px 0; font-size: 14px;"><strong>위치:</strong> ${report.location || '위치 정보 없음'}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>신고 시간:</strong> ${new Date(report.timestamp).toLocaleString('ko-KR')}</p>
                <p style="margin: 5px 0; font-size: 12px; color: #666;">좌표: ${lng}, ${lat}</p>
                ${report.ai_stage ? `<p style="margin: 5px 0; font-size: 12px; color: #666;">단계: ${report.ai_stage}</p>` : ''}
              </div>
            `);
            
            popup.addTo(map);
          });
          
          // 마커 생성 및 지도에 추가
          const marker = new maplibregl.Marker({ 
            element: el, 
            anchor: 'bottom',
            pitchAlignment: 'viewport',
            rotationAlignment: 'viewport'
          });
          
          // 좌표 설정 및 지도에 추가 (단계별로 분리)
          marker.setLngLat([lng, lat]);
          marker.addTo(map);
          
          // 마커가 올바르게 추가되었는지 확인 (즉시 확인)
          const markerLngLat = marker.getLngLat();
          console.log(`마커 ${index + 1} 실제 좌표 확인:`, markerLngLat);
          if (markerLngLat.lng !== lng || markerLngLat.lat !== lat) {
            console.warn(`마커 ${index + 1} 좌표 불일치! 설정: [${lng}, ${lat}], 실제: [${markerLngLat.lng}, ${markerLngLat.lat}]`);
          }
          
          // 마커 요소가 DOM에 제대로 추가되었는지 확인
          const markerElement = document.getElementById(markerId);
          if (!markerElement) {
            console.warn(`마커 ${index + 1} 요소가 DOM에 없음!`);
          }
          
          // 마커 참조 저장
          markerRefs.current.push(marker);
          console.log(`마커 ${index + 1} 추가됨 (ID: ${markerId}, 색상: ${markerColor}, 좌표: [${lng}, ${lat}])`);
          console.log(`마커 요소 확인:`, el);
          console.log(`마커 객체 확인:`, marker);
          console.log(`=== 마커 ${index + 1} 생성 완료 ===`);
        }
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
          const marker = new maplibregl.Marker({ 
            element: el,
            anchor: 'bottom',
            pitchAlignment: 'viewport',
            rotationAlignment: 'viewport'
          })
            .setLngLat([box.center_lon, box.center_lat])  // [경도, 위도] 순서로 정확히 설정
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
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',  // 무료로 사용 가능한 Carto 스타일
      center: [127.0, 37.5],  // 서울 중심 좌표
      zoom: 10,
      maxBounds: [
        [124, 33],  // 남서쪽 경계
        [132, 39]   // 북동쪽 경계
      ]
    });

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

    // 지도 이동 완료 후에만 마커 위치 업데이트
    map.on('moveend', () => {
      markerRefs.current.forEach(marker => {
        const currentLngLat = marker.getLngLat();
        marker.setLngLat(currentLngLat);
      });
    });

    mapRef.current = map;

    return () => {
      clearMarkers();
      clearToolboxMarkers();
      map.remove();
    };
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