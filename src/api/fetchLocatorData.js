// src/api/fetchLocatorData.js

async function getJson(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

export async function fetchLocatorData(signal) {
  const [brands, stores] = await Promise.all([
    getJson("/api/brands", signal),
    getJson("/api/stores", signal),
  ]);

  return {
    // az /api/brands { id, name }-et ad, a context { brand_id, brand_name }-et vár
    brands: brands.map((b) => ({ brand_id: b.id, brand_name: b.name })),
    stores,
  };
}