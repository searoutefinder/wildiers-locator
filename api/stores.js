// api/stores.js — Vercel serverless function
// Lekéri a Webflow "stores" kollekció publikált elemeit, és a store locator saját sémájára alakítja.

const DAYS = {
  mon: "openingsuren---monday",
  tue: "openingsuren---tuesday",
  wed: "openingsuren---wednesday",
  thu: "openingsuren---thursday",
  fri: "openingsuren---friday",
  sat: "openingsuren---saturday",
  sun: "openingsuren---sunday",
};

// "51.00148114120785, 3.803940539681922" -> [51.00148114120785, 3.803940539681922]  ([lat, lng], mint a saját sémádban)
function parseCoordinates(value) {
  if (typeof value !== "string") return null;
  const parts = value.split(",").map((s) => Number(s.trim()));
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) return null;
  return parts;
}

export function mapStore(item) {
  const fd = item.fieldData ?? {};

  const opening_times = {};
  for (const [key, field] of Object.entries(DAYS)) {
    opening_times[key] = fd[field] ?? "";
  }

  const images = (fd.gallery ?? []).map((img) => img?.url).filter(Boolean);

  return {
    id: item.id,
    name: fd.name ?? "",
    type: null, // nincs megfelelő mező a Webflow kollekcióban
    address: fd["contact-section-locatie"] ?? "",
    city: fd.city ?? "",
    postal: fd.postal ?? "",
    provincie: fd.provincie ?? "",
    email: fd["contact-section-e-mail"] ?? "",
    coordinates: parseCoordinates(fd.coordinates),
    cargo_on_display: Boolean(fd["contact-section-bike-types-display-cargo"]),
    has_ebikes: Boolean(fd["contact-section-bike-types-display-e-bike"]),
    is_xl_store: Boolean(fd["section-header-xl-store"]),
    opening_times,
    images,
    url: fd.slug ? `${process.env.STORE_PAGE_BASE_URL ?? ""}/${fd.slug}` : "",
    brands: fd.brands ?? [], // Webflow reference ID-k (a Brands kollekció elemei)
  };
}

async function fetchAllLiveItems(collectionId, token) {
  const items = [];
  let offset = 0;

  while (true) {
    const r = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items/live?limit=1000&offset=${offset}`,
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

export default async function handler(req, res) {
  if (!process.env.WEBFLOW_STORES_COLLECTION_ID || !process.env.WEBFLOW_TOKEN) {
    return res.status(500).json({
      error: "Hiányzó környezeti változó",
      WEBFLOW_COLLECTION_ID: Boolean(process.env.WEBFLOW_STORES_COLLECTION_ID),
      WEBFLOW_TOKEN: Boolean(process.env.WEBFLOW_TOKEN),
    });
  }

  try {
    const items = await fetchAllLiveItems(
      process.env.WEBFLOW_STORES_COLLECTION_ID,
      process.env.WEBFLOW_TOKEN
    );

    const stores = items
      .filter((it) => !it.isArchived && !it.isDraft)
      .map(mapStore)
      .filter((s) => s.coordinates); // koordináta nélkül nem tehető térképre

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
    return res.status(200).json(stores);
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: String(e.message ?? e) });
  }
}