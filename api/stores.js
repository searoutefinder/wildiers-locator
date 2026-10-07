export default async function handler(req, res) {
  const token = process.env.WEBFLOW_TOKEN;
  const collectionId = process.env.WEBFLOW_STORES_COLLECTION_ID;

  try {
    const items = [];
    let offset = 0;

    while (true) {
      const r = await fetch(
        `https://api.webflow.com/v2/collections/${collectionId}/items/live?limit=1000&offset=${offset}`,
        { headers: { Authorization: `Bearer ${token}`, accept: "application/json" } }
      );
      if (!r.ok) {
        return res.status(502).json({ error: `Webflow ${r.status}` });
      }
      const data = await r.json();
      items.push(...data.items);
      offset += data.items.length;
      if (offset >= data.pagination.total || data.items.length === 0) break;
    }

    // Vercel edge cache: 10 percig cache-ből szolgál ki, utána háttérben frissít
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
    return res.status(200).json(items);
  } catch (e) {
    return res.status(500).json({ error: "Internal error" });
  }
}