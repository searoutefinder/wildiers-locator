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
import NoResults from "./components/NoResults/NoResults";

// Internationalization
import { t } from "./i18n";

const CAROUSEL_INSET = 220;

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
  const hasResults = filteredFeatures?.features?.length > 0;

  // Refs
  const listRef = useRef(null);
  const cardRefs = useRef(new Map());
  const selectedFromListRef = useRef(false);
  const carouselRef = useRef(null);
  const mapWrapperRef = useRef(null);

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
    if (isDesktop) window.scrollTo({ top: 0 });
  };

  // Hooks
  useEffect(() => {
    setIsFilterSet(onlyXL || location != null || selectedBrands.length > 0 || selectedSpecializations.length > 0);

    setSelectedStore(null);
    setSelectedId(null);
    setSelectedStoreId(null);    
  }, [onlyXL, location, selectedBrands, selectedSpecializations]);

  // Mobilon lokáció kiválasztásakor (keresés vagy saját pozíció) a térkép tetejét a képernyő tetejére görgetjük.
  // A késleltetés megvárja, hogy a billentyűzet eltűnjön és a ResultsBar kinyíljon (0.25 s animáció).
  useEffect(() => {
    if (isDesktop || location == null) return;
    const timer = setTimeout(() => {
      mapWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
    return () => clearTimeout(timer);
  }, [location]);

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

  const onBrandChange = (a, options) => setSelectedBrands(options);
  const onSpecializationChange = (a, options) => setSelectedSpecializations(options);  

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
          {t("heading")} {t("headingWildiers")} <span className="text-[#5c733d]">{t("headingHighlight")}</span> {t("headingSuffix")}          
        </h2>
        <p className="text-lg text-[#0c0a09]">
          {t("introPrefix")} <span className="font-semibold">{stores.features.length}</span> {t("introSuffix")}
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

              {hasResults ? (
                <div ref={listRef} className="store-list relative flex min-h-0 flex-col gap-3 overflow-y-auto pr-2 [scrollbar-color:#99c066_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#99c066] [&::-webkit-scrollbar-thumb:hover]:bg-[#5c733d]">
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
              ) : (
                <NoResults 
                  className="min-h-0 flex-1"
                  onRemoveAll={clearAllFilters}
                />
              )}

              {isFilterSet && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-auto flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#e7e5e4] bg-white px-4 py-2 text-base text-[#161412]"
                >
                  <img alt="" className="size-4" src="/icons/material-symbols/store.svg" />
                  {t("showAll", {count: stores.features.length})}
                </button>
              )}
            </div>

            {/* Map */}
            <div className="h-[556px] min-w-0 flex-1">
              <MapPanel isDesktop={true} showPopup={true} />
            </div>

          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* Térkép + carousel egymásra rétegezve (grid, egy cellában) */}
            <div ref={mapWrapperRef} className="-mx-5 grid h-[650px] scroll-mt-0 grid-cols-1 overflow-hidden">

              <div className="min-h-0 min-w-0 [grid-area:1/1]">
                <MapPanel isDesktop={false} bottomInset={CAROUSEL_INSET} showPopup={false} />
              </div>

              <div className="pointer-events-none z-10 min-w-0 self-end bg-gradient-to-b from-transparent to-white pb-4 pt-10 [grid-area:1/1]">
                {hasResults ? (
                  <div
                    ref={carouselRef}
                    className="pointer-events-auto relative flex items-stretch snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {filteredFeatures?.features?.map((store) => (
                      <div
                        key={store.properties.id}
                        ref={registerCard(store.properties.id)}
                        className="flex w-[220px] shrink-0 snap-center"
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
                ) : (
                  <div className="pointer-events-auto px-4">
                    <NoResults className="h-[200px]" onRemoveAll={clearAllFilters}/>
                  </div>
                )}                
              </div>

            </div>

            {isFilterSet && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#e7e5e4] bg-white px-4 py-2 text-base text-[#161412]"
              >
                <img alt="" className="size-4" src="/icons/material-symbols/store.svg" />
                {t("showAll", {count: stores.features.length})}
              </button>
            )}

          </div>
        )}

      </div>

      {/* Alle winkels per provincie */}
      <div className="flex flex-col gap-6">
        <h3 className="text-[32px] font-bold leading-[1.3] text-[#161412]">{t("allStoresPerProvinceText")}</h3>
        <ProvinceAccordion provinces={provinces} />
      </div>
    </section>
  );
};

export default StoreLocatorSection;