import * as geolib from 'geolib';


/**
 * 计算所有点位的中心点和缩放比例
 */
export function calcCenterAndScale(points: any[]) {
  if (points.length === 1) {
    return {
      center: {
        latitude: points[0].latitude,
        longitude: points[0].longitude
      },
      scale: 10
    }
  }
  const center: any = geolib.getCenter(points);
  const near = geolib.findNearest(center, points);
  const distance = geolib.getDistance(center, near) * 1.5;

  const scales = {
    L10: 20,
    L20: 19,
    L50: 18,
    L100: 16,
    L200: 15,
    L500: 14,
    L1000: 13,
    L2000: 12,
    L5000: 11,
    L10000: 10.01,
    L20000: 9,
    L50000: 8,
    L100000: 6,
    L200000: 5,
    L500000: 4,
    L1000000: 3,
  };

  const distances = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 100000, 200000, 500000, 1000000];

  const finded = distances.reduce(function (prev, curr) {
    return (Math.abs(curr - distance) < Math.abs(prev - distance) ? curr : prev);
  });

  return {
    center,
    scale: scales['L' + finded]
  }
}