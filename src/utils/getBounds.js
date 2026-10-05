// utils/getBounds.js

/**
 * Pont feature-ök befoglaló téglalapja Mapbox fitBounds formátumban.
 *
 * @param {object} collection               GeoJSON FeatureCollection
 * @param {object} [options]
 * @param {Array}  [options.extraPoints]    további [lng, lat] pontok, pl. a felhasználó helye
 * @returns {[[number, number], [number, number]] | null}  [[west, south], [east, north]], vagy null ha nincs pont
 */
export const getBounds = (collection, { extraPoints = [] } = {}) => {
  const points = [
    ...(collection?.features ?? []).map((f) => f.geometry?.coordinates),
    ...extraPoints,
  ].filter(Array.isArray);

  if (points.length === 0) return null;

  return points.reduce(
    ([[minX, minY], [maxX, maxY]], [x, y]) => [
      [Math.min(minX, x), Math.min(minY, y)],
      [Math.max(maxX, x), Math.max(maxY, y)],
    ],
    [[Infinity, Infinity], [-Infinity, -Infinity]]
  );
};