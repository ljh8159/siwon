import json
import numpy as np
from shapely.geometry import shape
from pyproj import Transformer
from sklearn.cluster import DBSCAN

# 1. floodmap.json 불러오기
with open('floodmap.json', encoding='utf-8') as f:
    data = json.load(f)

features = data['features']

# 2. 변환기(한 번만 생성)
transformer = Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True)

# 3. 1~2등급 폴리곤만 추출, 중심점/면적 계산
centroids = []
areas = []
for feat in features:
    grade = int(feat['properties']['FLDN_GRD'])
    if grade in [1, 2]:
        geom = shape(feat['geometry'])
        centroid_3857 = geom.centroid
        area_3857 = geom.area  # 실제 m² 단위
        # 중심점만 WGS84로 변환
        lon, lat = transformer.transform(centroid_3857.x, centroid_3857.y)
        centroids.append([lon, lat])
        areas.append(area_3857)

# 4. DBSCAN 군집화(500m 이내, eps=0.0045)
X = np.array(centroids)
db = DBSCAN(eps=0.0045, min_samples=1).fit(X)
labels = db.labels_

# 5. 각 군집의 중심점 계산
result = []
for cluster_id in np.unique(labels):
    idxs = np.where(labels == cluster_id)[0]
    cluster_points = X[idxs]
    cluster_areas = [areas[i] for i in idxs]
    center_lon = cluster_points[:, 0].mean()
    center_lat = cluster_points[:, 1].mean()
    total_area = sum(cluster_areas)
    result.append({
        "cluster": int(cluster_id),
        "center_lon": center_lon,
        "center_lat": center_lat,
        "total_area_3857": total_area,
        "count": len(idxs)
    })

# 6. 결과 저장
with open('toolbox_recommend.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("완료! toolbox_recommend.json 파일이 생성되었습니다.")