// api/brands.js — Vercel serverless function

import { fetchAllLiveItems, isPublished, missingEnv } from "./webflow.js";
import { mapStore } from "./stores.js";

export function mapBrand(item) {
  return {
    id: item.id,
    name: (item.fieldData?.name ?? "").trim(),
  };
}

function collectUsedBrandIds(storeItems) {
  const used = new Set();
  storeItems
    .filter(isPublished)
    .map(mapStore)
    .filter((s) => s.coordinates)
    .forEach((s) => s.brands.forEach((id) => used.add(id)));
  return used;
}

export default async function handler(req, res) {
  const missing = missingEnv("WEBFLOW_TOKEN", "WEBFLOW_BRANDS_COLLECTION_ID", "WEBFLOW_STORES_COLLECTION_ID");
  if (missing.length) {
    return res.status(500).json({ error: "Hiányzó környezeti változó", missing });
  }

  try {
    const [brandItems, storeItems] = await Promise.all([
      fetchAllLiveItems(process.env.WEBFLOW_BRANDS_COLLECTION_ID, process.env.WEBFLOW_TOKEN),
      fetchAllLiveItems(process.env.WEBFLOW_STORES_COLLECTION_ID, process.env.WEBFLOW_TOKEN),
    ]);

    const usedBrandIds = collectUsedBrandIds(storeItems);

    const brands = brandItems
      .filter(isPublished)
      .filter((it) => usedBrandIds.has(it.id)) 
      .map(mapBrand)
      .filter((b) => b.name)
      .sort((a, b) => a.name.localeCompare(b.name, "nl", { sensitivity: "base" }));

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
    return res.status(200).json(brands);
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: String(e.message ?? e) });
  }
}