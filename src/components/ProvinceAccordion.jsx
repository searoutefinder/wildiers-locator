import { useState } from "react";
import { imgKeyboardArrowDown } from "../assets";
import StoreCard from "./StoreCard";

/**
 * "Alle Wildiers winkels per provincie" accordion.
 * Matches the Figma "Select" (open) / "Select" (collapsed row) components:
 * bordered panel, 12px padding, 16px gap between header and card row.
 *
 * The expanded card area is responsive: a 2-column grid on mobile (matching
 * the "Breakpoint=Mobile" Figma frame) and a single flex row on desktop
 * (`lg:`, matching the 1280px master) — cards there use flex-1 + min-w so
 * they share the row without spilling past the panel.
 *
 * @param {{name: string, count: number, stores: object[]}[]} provinces
 */
const ProvinceAccordion = ({ provinces, onExpandStore }) => {

  const [openProvince, setOpenProvince] = useState(null);

  const onStoreLink = (e, store) => {
    e.stopPropagation();
    if(store.url === "") { return; }
    const url = new URL(store.url);

    window.open(url.toString(), '_blank', 'noopener');
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {provinces.map((province) => {
        const isOpen = openProvince === province.name;

        if (isOpen) {
          return (
            <div
              key={province.name}
              className="flex w-full flex-col items-start gap-4 rounded-md border border-[#d6d3d1] bg-[#fafaf9] p-3"
            >
              <button
                type="button"
                onClick={() => setOpenProvince(null)}
                className=" cursor-pointer flex w-full items-center justify-between"
                aria-expanded="true"
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm text-[#161412]">{province.name}</span>
                  <span className="flex items-center justify-center rounded-xl bg-[#f5f5f4] px-2 py-0.5 text-xs font-semibold text-[#57544e]">
                    {province.count}
                  </span>
                </span>
                <img alt="" className="size-5 rotate-180 lg:size-6" src="/icons/material-symbols/keyboard_arrow_down.svg" />
              </button>

              <div className="grid w-full grid-cols-2 gap-3 lg:flex lg:items-stretch lg:overflow-x-auto">
                {province.stores.map((store) => (
                  <div 
                    key={store.properties.id}
                    className="flex min-w-0 lg:w-[220px] lg:shrink-0"
                  >
                    <StoreCard 
                      store={store.properties} 
                      size="small" 
                      onLink={onStoreLink}
                      onClick={() => {}}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <button
            key={province.name}
            type="button"
            onClick={() => setOpenProvince(province.name)}
            aria-expanded="false"
            className="cursor-pointer flex h-10 w-full items-center justify-between rounded-md border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2"
          >
            <span className="text-sm text-[#161412]">{province.name}</span>
            <img alt="" className="size-5" src="/icons/material-symbols/keyboard_arrow_down.svg" />
          </button>
        );
      })}
    </div>
  );
}

export default ProvinceAccordion;
