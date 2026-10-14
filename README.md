# Wildiers Store Locator

An interactive store locator for the Wildiers bike shops in Belgium. Visitors can search by location, use their own position, filter by brand, specialty or XL store, and browse the results on a Mapbox map, in a list (desktop) or in a swipeable card carousel (mobile). The store data is managed in the Webflow CMS and served to the app through two small Vercel serverless functions.

The UI is available in Dutch (default), French and English.

---

## Contents

- [Tech stack](#tech-stack)
- [How it works](#how-it-works)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API endpoints](#api-endpoints)
- [Webflow field mapping](#webflow-field-mapping)
- [Filtering logic](#filtering-logic)
- [Map](#map)
- [Internationalization](#internationalization)
- [Deployment](#deployment)
- [Notes and caveats](#notes-and-caveats)

---

## Tech stack

| Area | Library |
|---|---|
| Build tool | [Vite](https://vite.dev) 8 |
| UI | React 19 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| Map | Mapbox GL JS 3 |
| Animation | framer-motion (results bar, accordion) |
| Tooltips | `@floating-ui/react` |
| Linting | oxlint |
| Hosting | Vercel (static build + serverless functions in `/api`) |
| Content | Webflow CMS (Data API v2) |

---

## How it works

```
Webflow CMS ──(Data API v2, server-side token)──► /api/stores, /api/brands  (Vercel functions)
                                                         │   JSON, CDN-cached 10 min
                                                         ▼
Browser:  App.jsx ─► fetchLocatorData() ─► StoreLocatorProvider (context) ─► StoreLocatorSection
                                                         │
                                       ┌─────────────────┼──────────────────┐
                                    FilterBar        MapPanel        list / carousel / accordion
```

1. **`/api/stores`** and **`/api/brands`** call the Webflow Data API with a secret token, keep only published items, map them to the app's own schema and return plain JSON. The Webflow token never reaches the browser.
2. **`App.jsx`** fetches both endpoints in parallel (`src/api/fetchLocatorData.js`) and shows a loading or error state until the data arrives.
3. **`StoreLocatorProvider`** (`src/context/StoreLocatorContext.jsx`) converts the stores into a GeoJSON `FeatureCollection`, holds all filter and selection state, and derives `filteredFeatures`, `provinces` and `resultBounds` from it.
4. **`StoreLocatorSection`** renders the layout: the filter bar, the results bar, the map plus the list (desktop) or the map with a card carousel on top (mobile), and the "all stores per province" accordion.

---

## Project structure

```
├─ api/                         Vercel serverless functions (Node, run server-side)
│  ├─ stores.js                 GET /api/stores  – stores from Webflow, mapped + sorted
│  ├─ brands.js                 GET /api/brands  – brands from Webflow as { id, name }
│  └─ webflow.js                shared helpers: paginated fetch, published filter, env check
├─ public/
│  └─ icons/                    Material Symbols icons + store marker SVGs
├─ src/
│  ├─ main.jsx                  entry point
│  ├─ App.jsx                   data loading, loading/error states, context provider
│  ├─ StoreLocatorSection.jsx   main layout (desktop + mobile)
│  ├─ index.css                 Tailwind import + Mapbox control/popup overrides
│  ├─ api/
│  │  └─ fetchLocatorData.js    client-side fetch of /api/brands + /api/stores
│  ├─ context/
│  │  └─ StoreLocatorContext.jsx  state, filtering, provinces, map bounds
│  ├─ components/
│  │  ├─ FilterBar.jsx          location search, geolocate, brand/specialty selects, XL switch
│  │  ├─ ResultsBar.jsx         result count, active filter chips, "clear filters"
│  │  ├─ StoreCard.jsx          store card (sizes: default / small / carousel)
│  │  ├─ MapPanel.jsx           Mapbox map setup, fitBounds, flyTo
│  │  ├─ Layers/StoreLayer.jsx  GeoJSON source + symbol layer for the markers
│  │  ├─ StorePopup/            map popup (desktop only) rendering a StoreCard
│  │  ├─ LocationAutocomplete/  Mapbox Geocoding v6 search box
│  │  ├─ GeolocateButton/       browser geolocation + reverse geocoding
│  │  ├─ MultiSelect/           custom select (single or multi mode)
│  │  ├─ ProvinceAccordion.jsx  "all stores per province" accordion
│  │  ├─ NoResults/             empty state
│  │  ├─ Tooltip/               Floating UI tooltip
│  │  └─ Switch.jsx             toggle switch
│  ├─ hooks/useMediaQuery.js    desktop breakpoint (min-width: 1024px)
│  ├─ i18n/                     t() helper + nl/fr/en dictionaries
│  └─ utils/                    getBounds, sortByDistance (haversine), getBrandIds
├─ vercel.json                  SPA rewrite (keeps /api and /assets untouched)
└─ vite.config.js               React + Tailwind plugins, /api dev proxy
```

---

## Getting started

### Prerequisites

- Node.js 20.19+ (or 22.12+), as required by Vite
- npm
- Optional, for running the API functions locally: the [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)

### Install

```bash
npm install
```

### Run locally

There are two ways to run the app locally. The difference is where the `/api` requests go.

**Option A – frontend only, against the deployed API (default)**

```bash
npm run dev
```

`vite.config.js` proxies every `/api/*` request to `https://wildiers-locator-wip.vercel.app`. This needs no Webflow credentials, but changes in the `api/` folder only take effect after they are deployed.

You still need the client-side variables (`VITE_MAPBOX_TOKEN`, `VITE_MAPBOX_STYLE_URL`) in a `.env.local` file. See [Environment variables](#environment-variables).

**Option B – frontend and API functions together**

```bash
vercel link        # once: connect the folder to the Vercel project
vercel env pull    # downloads the environment variables into .env.local
vercel dev
```

`vercel dev` runs Vite and the functions in `/api` together, using the Webflow credentials from `.env.local`.

> `npm run dev` cannot execute the files in `/api` itself. Without the proxy, a request to `/api/stores` would return the source code of the file instead of JSON.

### Other scripts

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs oxlint |

### Testing a language locally

The language comes from the first URL segment (see [Internationalization](#internationalization)):

- `http://localhost:5173/` – Dutch
- `http://localhost:5173/fr` – French
- `http://localhost:5173/en` – English

---

## Environment variables

### Client-side (bundled into the JavaScript, visible to visitors)

| Variable | Description |
|---|---|
| `VITE_MAPBOX_TOKEN` | Mapbox **public** access token (map, geocoding, reverse geocoding). Restrict it to the production domains in the Mapbox account. |
| `VITE_MAPBOX_STYLE_URL` | Mapbox style URL, e.g. `mapbox://styles/<user>/<style-id>`. The style must contain the marker icons and the font listed under [Map](#map). |

### Server-side (only available to the `/api` functions)

| Variable | Description |
|---|---|
| `WEBFLOW_TOKEN` | Webflow Data API token with CMS read access. **Never prefix this with `VITE_`**, or it ends up in the public bundle. |
| `WEBFLOW_STORES_COLLECTION_ID` | ID of the Webflow stores collection |
| `WEBFLOW_BRANDS_COLLECTION_ID` | ID of the Webflow brands collection |
| `BASE_URL` | Base URL of the store detail pages on the website. The store's Webflow slug is appended to build the `url` field. |

Set the server-side variables in the Vercel dashboard (Project → Settings → Environment Variables). Changes only take effect in deployments created **after** the change, so redeploy afterwards.

If a required variable is missing, the endpoint responds with `500` and lists the missing names.

---

## API endpoints

Both endpoints are `GET`, return JSON, and set:

```
Cache-Control: s-maxage=600, stale-while-revalidate=3600
```

The Vercel CDN therefore serves cached data for 10 minutes and refreshes it in the background afterwards. **A change published in Webflow can take up to ~10 minutes to appear.** To see it immediately, purge the cache in the Vercel dashboard (CDN → Caches → Purge, tag `*`) or redeploy.

Upstream errors from Webflow are returned as `502` with the Webflow error message in the body.

### `GET /api/stores`

Returns an array of stores, sorted alphabetically by name (Dutch collation). Only published, non-archived stores with valid coordinates are included.

```json
[
  {
    "id": "6abff7750f0654232dc1f948",
    "store_num_id": 14,
    "name": "Melle",
    "type": "sportbike center",
    "address": "Brusselsesteenweg 264",
    "city": "Melle",
    "postal": "9090",
    "provincie": "Oost-Vlaanderen",
    "email": "melle@fietsenwildiers.be",
    "coordinates": [51.00148114120785, 3.803940539681922],
    "cargo_on_display": true,
    "has_ebikes": true,
    "is_xl_store": false,
    "opening_times": {
      "mon": "gesloten",
      "tue": "09:00–12:00 & 13:00–18:00",
      "wed": "…", "thu": "…", "fri": "…", "sat": "…", "sun": "gesloten"
    },
    "images": ["https://cdn.prod.website-files.com/…jpg"],
    "url": "https://…/melle",
    "storeurl": "https://…/melle",
    "brands": ["6abf5f5e0fec45f0ea06bcd6", "…"]
  }
]
```

- `coordinates` is **`[lat, lng]`** here. The context converts it to GeoJSON order (`[lng, lat]`).
- `store_num_id` is the 1-based position in the alphabetical list. It is the number shown on the map markers and cards. It is **not** a stable identifier: adding or renaming a store shifts the numbers. Use `id` for anything that has to stay stable.
- `brands` contains Webflow item IDs that match the `id` values of `/api/brands`.

### `GET /api/brands`

Returns the published brands as `{ id, name }`, sorted by name. Names are trimmed.

```json
[
  { "id": "6abf4f8ceab8e3fe5c961077", "name": "Achielle" },
  { "id": "6abf4fec037d6b4358c2f938", "name": "Aska" }
]
```

`fetchLocatorData` renames these to `{ brand_id, brand_name }` before passing them to the context.

---

## Webflow field mapping

Mapping from the Webflow stores collection (`fieldData`) to the API response, as implemented in `api/stores.js` (`mapStore`):

| Response field | Webflow field | Notes |
|---|---|---|
| `id` | item `id` | Webflow item ID |
| `name` | `name` | |
| `type` | `contact-section-bike-types-display-sport` | `true` → `"sportbike center"`, otherwise `"bike center"` |
| `address` | `contact-section-locatie` | |
| `city` | `city` | |
| `postal` | `postal` | |
| `provincie` | `provincie` | used for the province accordion |
| `email` | `contact-section-e-mail` | |
| `coordinates` | `coordinates` | text `"lat, lng"` → `[lat, lng]`; stores with invalid coordinates are dropped |
| `cargo_on_display` | `contact-section-bike-types-display-cargo` | |
| `has_ebikes` | `contact-section-bike-types-display-e-bike` | |
| `is_xl_store` | `section-header-xl-store` | |
| `opening_times.mon` … `.sun` | `openingsuren---monday` … `openingsuren---sunday` | free text, e.g. `"gesloten"` |
| `images` | `gallery[].url` | the cards use the first image |
| `url` | `slug` | `BASE_URL` + `/` + slug |
| `brands` | `brands` | multi-reference to the brands collection |

The brands collection only uses the item `id` and `name`.

> If a field is renamed in Webflow, its slug changes and the mapping in `api/stores.js` has to be updated as well.

---

## Filtering logic

All filtering happens client-side in `StoreLocatorContext.jsx` (`filteredFeatures`), in this order:

1. **Location** (search box or "use my location"): stores are sorted by straight-line (haversine) distance to the chosen point, and **only the 5 nearest** are kept. Each store gets a `distance_km` property.
2. **XL only**: keeps stores with `is_xl_store === true`.
3. **Brand**: keeps stores whose `brands` contain the selected brand ID.
4. **Specialty**: `"sportbike center"` matches `type === "sportbike center"`, `"cargo"` matches `cargo_on_display === true`.

Because the location step runs first, combining a location with other filters can return fewer than 5 stores, or none.

Brand and specialty use single-select mode (`MultiSelect` with `single`): choosing another option replaces the previous one.

Whenever a filter changes, the current selection and the map popup are cleared, and the map fits to the bounds of the remaining results (`resultBounds`, plus the user's location if set).

---

## Map

The map is set up in `src/components/MapPanel.jsx`, the markers in `src/components/Layers/StoreLayer.jsx`.

**Requirements for the Mapbox style** (`VITE_MAPBOX_STYLE_URL`):

- Marker icons in the style's sprite with these exact names:
  `store-marker-normal`, `store-marker-normal-selected`, `store-marker-xl`, `store-marker-xl-selected`.
  The source SVGs are in `public/icons/`.
- The font **`Inter Bold`**, used for the numbers on the markers.

**Behaviour**

- Initial view: Belgium (`[[2.51, 49.50], [6.41, 51.51]]`). Rotation is disabled.
- On mobile, **cooperative gestures** are on: the page scrolls with one finger, and moving the map needs two fingers. The hint texts are translated through the map's `locale` option.
- Clicking a marker selects the store. On desktop this opens a popup (`StorePopup`) and scrolls the sidebar list to the card. On mobile the carousel scrolls to the card instead.
- Clicking a card centres the map on that store (`flyTo`).
- On mobile, the map's bottom padding (`CAROUSEL_INSET` in `StoreLocatorSection.jsx`) keeps markers and controls clear of the card carousel.

**Location search** (`LocationAutocomplete`) uses the Mapbox Geocoding API v6, restricted to Belgium (`country=be`), with a 250 ms debounce and a minimum of 3 characters. **Use my location** (`GeolocateButton`) uses the browser Geolocation API, then reverse geocodes the position to a "City, postcode" label.

---

## Internationalization

- **Language detection** (`src/i18n/index.js`): taken from the first segment of the URL path. `/fr/…` gives French, `/en/…` English, anything else Dutch. Region suffixes are ignored (`/fr-be` → `fr`).
- **Dictionaries**: `src/i18n/locales/nl.json`, `fr.json`, `en.json`. All three must have the same keys. A missing key falls back to Dutch, and then to the key name itself, so gaps are visible.
- **Usage**:

  ```jsx
  import { t } from "../i18n";

  t("noResults")                                     // "Geen winkels gevonden"
  t("showAll", { count: 34 })                        // "Toon alle 34 winkels"
  ```

  Placeholders are written as `{name}` in the dictionary. The value has to be plain text. If part of a sentence needs its own markup (e.g. a bold number), split it into two keys, like `introPrefix` / `introSuffix`.
- **Adding a text**: add the key to all three JSON files, then use `t("key")` in the component.

The language is fixed for the page load, so there is no React context or re-render on language change.

> Store content coming from Webflow (names, opening hours, `"gesloten"`) is currently not localized. The API always reads the primary Webflow locale.

---

## Deployment

The project is deployed on **Vercel**:

- Pushing to the connected Git branch triggers a build (`vite build`). The output in `dist/` is served statically.
- Every file in `/api` becomes a serverless function at the same path (`api/stores.js` → `/api/stores`).
- `vercel.json` rewrites every path except `/api/*` and `/assets/*` to `index.html`. This is what makes `/fr` and `/en` work, since there are no physical files at those paths.
- Set the [environment variables](#environment-variables) for each Vercel environment (Production / Preview) where they are needed.

To check the API after a deploy, open `https://<your-deployment>/api/stores` in a browser. It should return JSON.

---

## Notes and caveats

- **Coordinate order.** The API returns `[lat, lng]`. `StoreLocatorContext` reverses it to `[lng, lat]` with `Array.prototype.reverse()`, which mutates the fetched data in place. Running that effect twice on the same data (e.g. in React Strict Mode, which is currently not enabled in `main.jsx`) would flip the coordinates back.