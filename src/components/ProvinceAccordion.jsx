import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StoreCard from "./StoreCard";

const TRANSITION = { duration: 0.25, ease: [0.4, 0, 0.2, 1] };

const ProvinceAccordion = ({ provinces }) => {

  const [openProvince, setOpenProvince] = useState(null);

  const toggle = (name) => setOpenProvince((current) => (current === name ? null : name));

  const onStoreLink = (e, store) => {
    e.stopPropagation();
    console.log(store)
    if(store.url === "") { return; }
    const url = new URL(store.url);

    window.open(url.toString(), '_blank', 'noopener');
  }

return (
    <div className="flex w-full flex-col gap-4">
      {provinces.map((province) => {
        const isOpen = openProvince === province.name;
        const panelId = `province-panel-${province.name}`;
 
        return (
          <div
            key={province.name}
            className={`w-full rounded-md border bg-[#fafaf9] px-3 transition-colors duration-200 ${
              isOpen ? "border-[#d6d3d1]" : "border-[#e7e5e4]"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(province.name)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex h-10 w-full cursor-pointer items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="text-sm text-[#161412]">{province.name}</span>
                {isOpen && (
                  <span className="flex items-center justify-center rounded-xl bg-[#f5f5f4] px-2 py-0.5 text-xs font-semibold text-[#57544e]">
                    {province.count}
                  </span>
                )}
              </span>
              <img
                alt=""
                src="/icons/material-symbols/keyboard_arrow_down.svg"
                className={`size-5 transition-transform duration-200 ${isOpen ? "rotate-180 lg:size-6" : ""}`}
              />
            </button>
 
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={TRANSITION}
                  style={{ overflow: "hidden" }}
                >
                  {/* a padding a belső divre kerül, hogy a height animáció 0-ig tudjon menni */}
                  <div className="grid w-full grid-cols-2 gap-3 pb-3 pt-2 lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                    {province.stores.map((store) => (
                      <div key={store.properties.id} className="flex min-w-0">
                        <StoreCard
                          store={store.properties}
                          size="small"
                          onLink={onStoreLink}
                          onClick={() => {}}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default ProvinceAccordion;
