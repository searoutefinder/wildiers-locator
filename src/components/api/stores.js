// src/api/stores.js
export async function fetchStores(signal) {
  const res = await fetch(`${import.meta.env.VITE_STORES_URL_BASE}${import.meta.env.VITE_STORES_URL_COLLECTION_ID}${import.meta.env.VITE_STORES_URL_SUFFIX}`, { signal }); // pl. /data/stores.geojson vagy a Worker URL-je
  if (!res.ok) throw new Error(`Stores fetch failed: ${res.status}`);
  return res.json(); // már GeoJSON FeatureCollection
}