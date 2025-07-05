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

  const clearMarkers = () => {
    markerRefs.current.forEach(marker => marker.remove());
    markerRefs.current = [];
  };

  const loadMarkers = (map) => {
    fetch(`${API_URL}/api/reports`)
      .then(res => {
        if (!res.ok) throw new Error('API 응답 오류');
        return res.json();
      })
      .then(data => {
        markerRefs.current.forEach(marker => marker.remove());
        markerRefs.current = [];
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
                '1', '#ff0000',
                '2', '#ff8c00',
                '3', '#ffff00',
                '4', '#00c8ff',
                '5', '#0000ff',
                '#888888'
              ],
              'fill-opacity': 0.5,
              'fill-outline-color': '#333'
            }
          });
        });

      // DB에서 마커 불러오기 (최초 1회)
      loadMarkers(map);
    });

    return () => {
      if (map) map.remove();
      clearMarkers();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.container}>
      {/* '📍 도로뚫이단 - 하수구 지도', '사진업로드 부분', '현재 클릭한 주소' 삭제 */}
      {/* 범례는 그대로 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        margin: '10px 0',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontSize: '0.95em'
      }}>
        <span style={{ fontWeight: 'bold' }}>범례:</span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            display: 'inline-block', width: 14, height: 14, background: '#ff0000', marginRight: 3, border: '1px solid #333'
          }}></span> 1등급
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            display: 'inline-block', width: 14, height: 14, background: '#ff8c00', marginRight: 3, border: '1px solid #333'
          }}></span> 2등급
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            display: 'inline-block', width: 14, height: 14, background: '#ffff00', marginRight: 3, border: '1px solid #333'
          }}></span> 3등급
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            display: 'inline-block', width: 14, height: 14, background: '#00c8ff', marginRight: 3, border: '1px solid #333'
          }}></span> 4등급
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            display: 'inline-block', width: 14, height: 14, background: '#0000ff', marginRight: 3, border: '1px solid #333'
          }}></span> 5등급
        </span>
      </div>
      <div className={styles.mapArea}>
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>
    </div>
  );
};

export default MapPage;