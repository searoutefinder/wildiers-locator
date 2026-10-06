// Core
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useStoreLocator } from "./context/StoreLocatorContext";
import useMediaQuery from "./hooks/useMediaQuery";

// Custom
import FilterBar from "./components/FilterBar";
import ResultsBar from "./components/ResultsBar";
import StoreCard from "./components/StoreCard";
import MapPanel from "./components/MapPanel";
import ProvinceAccordion from "./components/ProvinceAccordion";

const CAROUSEL_INSET = 170;

const StoreLocatorSection = () => {

  // Context
  const {
    stores,
    provinces,
    brands,
    specializations,
    selectedId,
    setSelectedId,
    selectedBrands,
    setSelectedBrands,
    selectedSpecializations,
    setSelectedSpecializations,
    location,
    setLocation,
    isFilterSet,
    setIsFilterSet,
    filteredFeatures,
    setOnlyXL,
    onlyXL,
    selectedStoreId,
    setSelectedStoreId,
    selectedStore,
    setSelectedStore,
  } = useStoreLocator();

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Refs
  const listRef = useRef(null);
  const cardRefs = useRef(new Map());
  const selectedFromListRef = useRef(false);
  const carouselRef = useRef(null);

  // Helpers

  const registerCard = (id) => (el) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  };

  const scrollToCard = (id) => {
    const card = cardRefs.current.get(id);
    if (!card) return;

    if (isDesktop) {
      listRef.current?.scrollTo({ top: card.offsetTop, behavior: "smooth" });
    } else {
      const c = carouselRef.current;
      if (!c) return;
      // a kiválasztott kártyát középre görgeti
      c.scrollTo({
        left: card.offsetLeft - (c.clientWidth - card.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  const clearAllFilters = () => {
    setLocation(null);
    setIsFilterSet(false);
    setOnlyXL(false);
    setSelectedBrands([]);
    setSelectedSpecializations([]);
    window.scrollTo({ top: 0 });
  };

  // Hooks
  useEffect(() => {
    setIsFilterSet(onlyXL || location != null || selectedBrands.length > 0 || selectedSpecializations.length > 0);
  }, [onlyXL, location, selectedBrands, selectedSpecializations]);

  useEffect(() => {
    // Kártyára kattintottak, nem görgetünk
    if (selectedFromListRef.current) {
      selectedFromListRef.current = false;
      return;
    }
    if (selectedId == null) return;

    scrollToCard(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (selectedStore?.id == null || selectedStore?.source === "list") return;

    scrollToCard(selectedStore.id);
  }, [selectedStore]);

  // Handlers

  const onCardClick = (e, f) => {
    selectedFromListRef.current = true;
    setSelectedStore({ id: f.id, source: "list" });
    setSelectedId(f.id);
    setSelectedStoreId(f.id);
  };

  const onBrandChange = (a, options, c) => {
    if (options.length > 1) return;
    setSelectedBrands(options);
  };

  const onSpecializationChange = (a, options, c) => {
    if (options.length > 1) return;
    setSelectedSpecializations(options);
  };

  const onLocationChange = (e) => {
    setLocation(e);
  };

  const onXlToggleChange = () => {
    setOnlyXL((v) => !v);
  };

  const onRoutePlan = (e, store) => {
    e.stopPropagation();

    const url = new URL("https://www.google.com/maps/dir/");
    url.searchParams.set("api", "1");
    url.searchParams.set("destination", `${store.coordinates[1]},${store.coordinates[0]}`);
    url.searchParams.set("travelmode", "driving");

    window.open(url.toString(), "_blank", "noopener");
  };

  const onStoreLink = (e, store) => {
    e.stopPropagation();
    if (store.url === "") return;
    const url = new URL(store.url);

    window.open(url.toString(), "_blank", "noopener");
  };

  const onTestRide = (e) => {
    e.stopPropagation();
  };

  // JSX
  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-10 lg:gap-12 lg:px-20 lg:py-16">

      {/* Heading (same 48px/18px type scale on mobile and desktop) */}
      <div className="flex max-w-[768px] flex-col gap-2">
        <h2 className="text-[48px] font-bold leading-[1.2] text-[#161412]">
          Vind een <span className="text-[#5c733d]">fietswinkel</span> in jouw buurt
        </h2>
        <p className="text-lg text-[#0c0a09]">
          Met meer dan <span className="font-semibold">{stores.features.length}</span> fietswinkels in Vlaanderen is er altijd een
          Wildiers vlakbij. Zoek op locatie of ontdek winkels op basis van een merk of specialisatie, zoals
          sportfietsen of bakfietsen. Vergelijk verschillende fietsen, plan een gratis testrit en krijg
          persoonlijk advies van mensen die even wild zijn op fietsen als jij.
        </p>
      </div>

      {/* Filters + results + list/map */}
      <div className="flex flex-col gap-6">

        <FilterBar
          selectedBrands={selectedBrands}
          brandOptions={brands}
          onBrandChange={onBrandChange}

          specialty={selectedSpecializations}
          specialtyOptions={specializations}
          onSpecialtyChange={onSpecializationChange}

          onLocationChange={onLocationChange}
          onXlToggleChange={onXlToggleChange}
        />

        <AnimatePresence initial={false}>
          {isFilterSet && (
            <motion.div
              key="results-bar"
              initial={{ height: 0, opacity: 0, marginBottom: -24 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 0 }}
              exit={{ height: 0, opacity: 0, marginBottom: -24 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: "hidden" }}
            >
              <ResultsBar
                resultCount={filteredFeatures.features.length}
                locationLabel={location?.text}
                onRemoveLocation={() => setLocation(null)}
                activeFilters={[...selectedBrands, ...selectedSpecializations]}
                onRemoveFilter={(f) => {
                  setSelectedBrands((prev) => prev.filter((b) => b.id !== f.id));
                  setSelectedSpecializations((prev) => prev.filter((b) => b.id !== f.id));
                }}
                onClearAll={clearAllFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isDesktop ? (
          <div className="flex w-full items-start gap-2">

            {/* Sidebar */}
            <div className="flex h-[556px] w-[360px] shrink-0 flex-col gap-6 overflow-y-auto">
              <div ref={listRef} className="store-list relative flex min-h-0 flex-col gap-3 overflow-y-auto pr-2">
                {filteredFeatures?.features?.map((store) => (
                  <div key={store.properties.id} ref={registerCard(store.properties.id)}>
                    <StoreCard
                      store={{ ...store.properties, highlighted: store.properties.id === selectedStoreId }}
                      size="default"
                      onRoutePlan={onRoutePlan}
                      onTestRide={onTestRide}
                      onClick={onCardClick}
                      onLink={onStoreLink}
                    />
                  </div>
                ))}
              </div>

              {isFilterSet && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-auto flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#e7e5e4] bg-white px-4 py-2 text-base text-[#161412]"
                >
                  <img alt="" className="size-4" src="/icons/material-symbols/store.svg" />
                  Toon alle {stores.features.length} winkels
                </button>
              )}
            </div>

            {/* Map */}
            <div className="h-[556px] min-w-0 flex-1">
              <MapPanel />
            </div>

          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* Térkép + carousel egymásra rétegezve (grid, egy cellában) */}
            <div className="-mx-5 grid h-[450px] grid-cols-1 overflow-hidden">

              <div className="min-h-0 min-w-0 [grid-area:1/1]">
                <MapPanel bottomInset={CAROUSEL_INSET} />
              </div>

              <div className="pointer-events-none z-10 min-w-0 self-end bg-gradient-to-b from-transparent to-white pb-4 pt-10 [grid-area:1/1]">
                <div
                  ref={carouselRef}
                  className="pointer-events-auto relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {filteredFeatures?.features?.map((store) => (
                    <div
                      key={store.properties.id}
                      ref={registerCard(store.properties.id)}
                      className="shrink-0 snap-center"
                    >
                      <StoreCard
                        store={{ ...store.properties, highlighted: store.properties.id === selectedStoreId }}
                        size="small"
                        onRoutePlan={onRoutePlan}
                        onTestRide={onTestRide}
                        onClick={onCardClick}
                        onLink={onStoreLink}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {isFilterSet && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#e7e5e4] bg-white px-4 py-2 text-base text-[#161412]"
              >
                <img alt="" className="size-4" src="/icons/material-symbols/store.svg" />
                Toon alle {stores.features.length} winkels
              </button>
            )}

          </div>
        )}

      </div>

      {/* Alle winkels per provincie */}
      <div className="flex flex-col gap-6">
        <h3 className="text-[32px] font-bold leading-[1.3] text-[#161412]">Alle Wildiers winkels per provincie</h3>
        <ProvinceAccordion provinces={provinces} defaultOpenProvince="Antwerpen" />
      </div>
    </section>
  );
};

export default StoreLocatorSection;