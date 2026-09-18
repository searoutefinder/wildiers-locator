import { useState } from "react";
import FilterBar from "./components/FilterBar";
import ResultsBar from "./components/ResultsBar";
import StoreCard from "./components/StoreCard";
import MapPanel from "./components/MapPanel";
import ProvinceAccordion from "./components/ProvinceAccordion";

/**
 * "Winkels Section Mapbox" — full Wildiers store-locator section.
 * Figma: https://www.figma.com/design/X81XHvMooJp9ML06ljL2dL/Wildiers-WF-2026?node-id=10346-16233
 *
 * This composes the pieces in ./components/*. Wire `nearbyStores`,
 * `markers` and `provinces` up to your real data source — everything
 * below `// --- demo data ---` is placeholder content taken from the design.
 */
export default function StoreLocatorSection({
  nearbyStores = demoNearbyStores,
  markers = demoMarkers,
  mobileMarkers = demoMobileMarkers,
  provinces = demoProvinces,
}) {
  const [location, setLocation] = useState("Leuven, 3000");
  const [xlOnly, setXlOnly] = useState(false);
  const [brand, setBrand] = useState("Achielle");
  const [specialty, setSpecialty] = useState("Sport");
  const [selectedStoreId, setSelectedStoreId] = useState(nearbyStores[1]?.id ?? nearbyStores[0]?.id);

  const selectedStore = nearbyStores.find((s) => s.id === selectedStoreId);

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-10 lg:gap-12 lg:px-20 lg:py-16">
      {/* Heading (same 48px/18px type scale on mobile and desktop) */}
      <div className="flex max-w-[768px] flex-col gap-2">
        <h2 className="text-[48px] font-bold leading-[1.2] text-[#161412]">
          Vind een <span className="text-[#5c733d]">fietswinkel</span> in jouw buurt
        </h2>
        <p className="text-lg text-[#0c0a09]">
          Met meer dan <span className="font-semibold">35</span> fietswinkels in Vlaanderen is er altijd een
          Wildiers vlakbij. Zoek op locatie of ontdek winkels op basis van een merk of specialisatie, zoals
          sportfietsen of bakfietsen. Vergelijk verschillende fietsen, plan een gratis testrit en krijg
          persoonlijk advies van mensen die even wild zijn op fietsen als jij.
        </p>
      </div>

      {/* Filters + results + list/map */}
      <div className="flex flex-col gap-6 ">
        <FilterBar
          location={location}
          onLocationChange={setLocation}
          onUseMyLocation={() => {}}
          xlOnly={xlOnly}
          onXlOnlyChange={setXlOnly}
          brand={brand}
          onBrandChange={setBrand}
          brandOptions={["Achielle", "Gazelle", "Cortina"]}
          specialty={specialty}
          onSpecialtyChange={setSpecialty}
          specialtyOptions={["Sport", "E-bike", "Cargo"]}
        />

        <ResultsBar
          resultCount={nearbyStores.length}
          locationLabel={location}
          onRemoveLocation={() => setLocation("")}
          activeFilters={[brand, specialty].filter(Boolean)}
          onRemoveFilter={(f) => (f === brand ? setBrand("") : setSpecialty(""))}
          onClearAll={() => {
            setLocation("");
            setBrand("");
            setSpecialty("");
          }}
        />

        {/* Desktop (lg:): sidebar store list + divider + inset map, all within the section's side padding */}
        <div className="hidden w-full items-start gap-2 lg:flex">
          <div className="flex w-[360px] h-[956px] shrink-0 flex-col gap-6 overflow-y-auto">
            <div className="pr-2 store-list flex min-h-0 flex-col gap-3 overflow-y-auto">
              {
                nearbyStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={{ ...store, highlighted: store.id === selectedStoreId }}
                    size="default"
                    onRoutePlan={() => {}}
                    onTestRide={() => {}}
                  />
                ))
              }
            </div>
            <button
              type="button"
              className="mt-auto flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#e7e5e4] bg-white px-4 py-2 text-base text-[#161412]"
            >
              Toon alle 35 winkels
            </button>
          </div>

          <div className="min-w-0 flex-1 h-[956px]">
            <MapPanel
              markers={markers}
              selectedStore={selectedStore ? { ...selectedStore, highlighted: true } : undefined}
              onMarkerClick={(m) => m.storeId && setSelectedStoreId(m.storeId)}
              onZoomIn={() => {}}
              onZoomOut={() => {}}
            />
          </div>
        </div>

        {/* Mobile: full-bleed map + horizontal store carousel (breaks out of the section's side padding), then the "toon alle" button */}
        <div className="flex flex-col gap-6 lg:hidden">
          <div className="-mx-5">
            <MapPanel
              mobileMarkers={mobileMarkers}
              carouselStores={nearbyStores.map((store) => ({ ...store, highlighted: store.id === selectedStoreId }))}
              onMarkerClick={(m) => m.storeId && setSelectedStoreId(m.storeId)}
              onZoomIn={() => {}}
              onZoomOut={() => {}}
            />
          </div>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#e7e5e4] bg-white px-4 py-2 text-base text-[#161412]"
          >
            Toon alle 35 winkels
          </button>
        </div>
      </div>

      {/* Alle winkels per provincie */}
      <div className="flex flex-col gap-6">
        <h3 className="text-[32px] font-bold leading-[1.3] text-[#161412]">Alle Wildiers winkels per provincie</h3>
        <ProvinceAccordion provinces={provinces} defaultOpenProvince="Antwerpen" />
      </div>
    </section>
  );
}

// --- demo data (from the Figma mock) — replace with real data ---

const demoNearbyStores = [
  {
    id: 1,
    name: "Wildiers Leuven",
    number: 1,
    xlStore: true,
    distanceKm: 2.4,
    status: "open",
    statusDetail: "tot 18:00",
    types: ["E-bike", "Sport", "Cargo"],
  },
  {
    id: 2,
    name: "Wildiers Keerbergen",
    number: 2,
    xlStore: true,
    distanceKm: 2.4,
    status: "open",
    statusDetail: "tot 18:00",
    types: ["E-bike", "Sport", "Cargo"],
  },
  {
    id: 3,
    name: "Wildiers Aarschot",
    number: 3,
    xlStore: false,
    distanceKm: 2.4,
    status: "closed",
    statusDetail: "opent morgen om 09:00",
    types: ["E-bike", "Sport", "Cargo"],
  },
];

// xPct/yPct and color/xl match the Figma markers exactly (percentages of the 888×956 map canvas).
const demoMarkers = [
  { id: "m1", storeId: 1, number: 1, color: "black", xl: false, xPct: 74.66, yPct: 25.94 },
  { id: "m2", storeId: 2, number: 2, color: "green", xl: true, xPct: 32.3, yPct: 37.87 },
  { id: "m3", storeId: 3, number: 3, color: "black", xl: true, xPct: 68.47, yPct: 57.85 },
];

// The mobile mock uses a different map crop/zoom than desktop, so it has its
// own marker layout — percentages of the 375×668 mobile map canvas.
const demoMobileMarkers = [
  { id: "mm1", storeId: 1, number: 1, color: "black", xl: false, xPct: 61.6, yPct: 15.7 },
  { id: "mm2", storeId: 2, number: 2, color: "green", xl: true, xPct: 37.87, yPct: 30.99 },
];

const demoProvinceStore = {
  id: "p1",
  name: "Wildiers Keerbergen",
  number: 1,
  xlStore: true,
  status: "open",
  statusDetail: "tot 18:00",
  types: ["E-bike", "Sport", "Cargo"],
};

const demoProvinces = [
  {
    name: "Antwerpen",
    count: 10,
    stores: [
      { ...demoProvinceStore, id: "a1" },
      { ...demoProvinceStore, id: "a2", xlStore: false },
      { ...demoProvinceStore, id: "a3" },
      { ...demoProvinceStore, id: "a4", xlStore: false },
      { ...demoProvinceStore, id: "a5" },
    ],
  },
  { name: "Vlaams-Brabant", count: 8, stores: [] },
  { name: "Limburg", count: 6, stores: [] },
  { name: "Oost-Vlaanderen", count: 5, stores: [] },
  { name: "West-Vlaanderen", count: 4, stores: [] },
  { name: "Brussel", count: 2, stores: [] },
];
