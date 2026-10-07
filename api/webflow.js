// api/_lib/webflow.js — közös Webflow segédfüggvények.
// Az "_" prefixű mappát a Vercel nem teszi ki végpontként, csak importálható.

export async function fetchAllLiveItems(collectionId, token) {
  const items = [];
  let offset = 0;

  while (true) {
    const r = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items/live?limit=100&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}`, accept: "application/json" } }
    );
    if (!r.ok) {
      const body = await r.text();
      throw new Error(`Webflow ${r.status} (collection: ${collectionId}): ${body}`);
    }

    const data = await r.json();
    items.push(...data.items);
    offset += data.items.length;
    if (offset >= data.pagination.total || data.items.length === 0) break;
  }
  return items;
}

// Csak a publikált, nem archivált elemek
export const isPublished = (it) => !it.isArchived && !it.isDraft;

// Hiányzó env változók listája, vagy üres tömb, ha minden megvan
export const missingEnv = (...names) => names.filter((n) => !process.env[n]);