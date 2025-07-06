import React, { useEffect, useRef } from 'react';
import styles from '../styles/MapPage.module.css';
import proj4 from "proj4";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://backendflask-production-f4c6.up.railway.app';

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

  const clearMarkers = () => {
    markerRefs.current.forEach(marker => marker.remove());
    markerRefs.current = [];
  };

  const clearToolboxMarkers = () => {
    toolboxMarkerRefs.current.forEach(marker => marker.remove());
    toolboxMarkerRefs.current = [];
  };

  // DB 마커 표시
  const loadMarkers = (map) => {
    fetch(`${API_URL}/api/reports`)
      .then(res => {
        if (!res.ok) throw new Error('API 응답 오류');
        return res.json();
      })
      .then(data => {
        clearMarkers();
        data.forEach(report => {
          const lng = parseFloat(report.lng);
          const lat = parseFloat(report.lat);
          if (!isNaN(lng) && !isNaN(lat)) {
            const el = document.createElement('div');
            el.style.background = 'red';
            el.style.width = '12px';
            el.style.height = '12px';
            el.style.borderRadius = '50%';
            el.style.border = '2px solid white';
            el.style.boxShadow = '0 0 6px #333';
            el.style.cursor = 'pointer';
            el.title = `위도: ${lat}, 경도: ${lng}`;
            const marker = new maplibregl.Marker({ element: el })
              .setLngLat([lng, lat])
              .addTo(map);
            markerRefs.current.push(marker);
          }
        });
      })
      .catch(err => {
        console.error('마커 불러오기 실패:', err);
      });
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
      {/* '📍 도로뚫이단 - 하수구 지도', '사진업로드 부분', '현재 클릭한 주소' 삭제 */}
      {/* 상단 범례 완전 삭제 */}
      <div className={styles.mapArea}>
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>
      {/* 지도 아래 안내 */}
      {/* 기존 안내문구 영역 전체 삭제 */}
    </div>
  );
};

export default MapPage;