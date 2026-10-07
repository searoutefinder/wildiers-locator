// api/brands.js — Vercel serverless function
// A Webflow Brands kollekcióból csak { id, name } objektumokat ad vissza, név szerint rendezve.

import { fetchAllLiveItems, isPublished, missingEnv } from "./_lib/webflow.js";

export function mapBrand(item) {
  return {
    id: item.id, // Webflow item ID — ezt hivatkozzák a store-ok "brands" tömbjei
    name: (item.fieldData?.name ?? "").trim(), // pl. "Dolly " -> "Dolly"
  };
}

export default async function handler(req, res) {
  const missing = missingEnv("WEBFLOW_TOKEN", "WEBFLOW_BRANDS_COLLECTION_ID");
  if (missing.length) {
    return res.status(500).json({ error: "Hiányzó környezeti változó", missing });
  }

  try {
    const items = await fetchAllLiveItems(
      process.env.WEBFLOW_BRANDS_COLLECTION_ID,
      process.env.WEBFLOW_TOKEN
    );

    const brands = items
      .filter(isPublished)
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