// Core
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useStoreLocator } from "./context/StoreLocatorContext";

// Custom
import FilterBar from "./components/FilterBar";
import ResultsBar from "./components/ResultsBar";
import StoreCard from "./components/StoreCard";
import MapPanel from "./components/MapPanel";
import ProvinceAccordion from "./components/ProvinceAccordion";

const StoreLocatorSection = ({}) => {
  
  // Context

  const { data, stores, provinces, brands, specializations, selectedId, setSelectedId, selectedBrands, setSelectedBrands, 
    selectedSpecializations, setSelectedSpecializations,
    location, setLocation, isFilterSet, setIsFilterSet, filteredFeatures, setOnlyXL, onlyXL, selectedStoreId, setSelectedStoreId } = useStoreLocator();

  // Refs
  const listRef = useRef(null);
  const cardRefs = useRef(new Map());
  const selectedFromListRef = useRef(false);

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

    const container = listRef.current;
    const card = cardRefs.current.get(selectedId);
    if (!container || !card) return;

    container.scrollTo({
      top: card.offsetTop,
      behavior: "smooth",
    });
  }, [selectedId]);

  // Selection related
  //const [selectedStoreId, setSelectedStoreId] = useState(null);
  //const [selectedStore, setSelectedStore] = useState(null);

  const onBrandChange = (a, options, c) => {
    if (options.length > 1) return;
    setSelectedBrands(options);
  };

  const onSpecializationChange = (a, options, c) => {    
    if (options.length > 1) return;
    setSelectedSpecializations(options);
  }

  const onLocationChange = (e) => {
    setLocation(e)
  }

  const onXlToggleChange = () => {
    setOnlyXL((v) => !v);
  }  
 

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
      <div className="flex flex-col gap-6 ">
        
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
              activeFilters={[...selectedBrands,...selectedSpecializations]}
              onRemoveFilter={(f) => {
                setSelectedBrands((prev) => prev.filter((b) => b.id !== f.id));
                setSelectedSpecializations((prev) => prev.filter((b) => b.id !== f.id));
              }}
              onClearAll={() => {
                setLocation(null);
                setIsFilterSet(false);
                setOnlyXL(false);
                setSelectedBrands([]);
                setSelectedSpecializations([]);
                window.scrollTo({ top: 0 });
              }}
            />
          </motion.div>
        )}
        </AnimatePresence>

        {/* Desktop (lg:): sidebar store list + divider + inset map, all within the section's side padding */}
        <div className="hidden w-full items-start gap-2 lg:flex">
          
          {/* Sidebar */}
          <div className="flex w-[360px] h-[556px] shrink-0 flex-col gap-6 overflow-y-auto">
            <div ref={listRef} className="relative pr-2 store-list flex min-h-0 flex-col gap-3 overflow-y-auto">
              {
                filteredFeatures?.features?.map((store) => (
                <div
                  key={store.properties.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(store.properties.id, el);
                    else cardRefs.current.delete(store.properties.id);
                  }}
                >                  
                  <StoreCard
                    key={store.properties.id}
                    store={{ ...store.properties, highlighted: store.properties.id === selectedStoreId }}
                    size="default"
                    onRoutePlan={(e) => {
                      e.stopPropagation();
                      console.log(e)
                    }}
                    onTestRide={(e) => {
                      e.stopPropagation();
                      console.log(e)
                    }}
                    onClick={(e, f) => { 
                      console.log(f);
                      setSelectedId(f.id);
                      setSelectedStoreId(f.id);
                    }}
                  />
                  </div>
                ))
              }
            </div>

            {isFilterSet && (
              <button
                type="button"
                onClick={() => {
                  setLocation(null);
                  setIsFilterSet(false);
                  setOnlyXL(false);
                  setSelectedBrands([]); 
                  setSelectedSpecializations([]); 
                  window.scrollTo({ top: 0 });                        
                 }
                }
                className="
                  cursor-pointer
                  mt-auto
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-md                 
                  border
                  border-[#e7e5e4]
                  bg-white
                  px-4
                  py-2
                  text-base
                  text-[#161412]
                "
              >
                <img 
                  alt=""
                  className="size-4"
                  src="/icons/material-symbols/store.svg"
                />
                Toon alle {stores.features.length} winkels
              </button>
            )}

          </div>

          {/* Map */}
          <div className="min-w-0 flex-1 h-[556px]">
            <MapPanel
              onZoomIn={() => {}}
              onZoomOut={() => {}}
            />
          </div>
        </div>

        {/* Mobile: full-bleed map + horizontal store carousel (breaks out of the section's side padding), then the "toon alle" button */}
        <div className="flex flex-col gap-6 lg:hidden">
          <div className="-mx-5">

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

export default StoreLocatorSection;
