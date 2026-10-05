const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;

// Haversine távolság két [lng, lat] pont között, km-ben
export const haversineKm = ([lng1, lat1], [lng2, lat2]) => {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

// Új FeatureCollection-t ad vissza, távolság szerint növekvő sorrendben.
// Minden feature properties-ébe bekerül a distance_km; az eredeti adat nem módosul.
export const sortByDistance = (collection, origin) => {
  if (!collection?.features) return { type: "FeatureCollection", features: [] };
  if (!origin) return collection;

  const features = collection.features
    .map((f) => ({
      ...f,
      properties: {
        ...f.properties,
        distance_km: haversineKm(origin, f.geometry.coordinates),
      },
    }))
    .sort((a, b) => a.properties.distance_km - b.properties.distance_km);

  return { ...collection, features };
};