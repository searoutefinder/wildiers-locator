import { useState } from "react";
import { imgSearch, imgMyLocation, imgInfo, imgKeyboardArrowDown } from "../assets";
import Switch from './Switch'; 

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex h-10 w-full flex-1 items-center justify-between rounded-md border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full flex-1 appearance-none bg-transparent text-sm text-[#161412] focus:outline-none"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <img alt="" className="size-5 shrink-0" src={imgKeyboardArrowDown} />
    </div>
  );
}

/**
 * Search + filter bar at the top of the store locator ("Filter Section" in Figma).
 *
 * Desktop (`lg:`, 1280px master): search + location button on one row, then a
 * toggle/info row — with the two Selects in a separate 400px-wide right column.
 * Mobile (base, 375px "Breakpoint=Mobile" frame): a single stacked column —
 * search row with an icon-only location button, then the two Selects full-width,
 * then the toggle/info row.
 */
export default function FilterBar({
  location,
  onLocationChange,
  onUseMyLocation,
  xlOnly,
  onXlOnlyChange,
  brand,
  onBrandChange,
  brandOptions = [],
  specialty,
  onSpecialtyChange,
  specialtyOptions = [],
}) {

  const [filterEnabled, setFilterEnabled] = useState(false);

  const filterToggleChanged = () => {
    setFilterEnabled(!filterEnabled);
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 lg:flex-row lg:items-start lg:gap-8">
      <div className="flex w-full min-w-0 flex-col gap-4 lg:flex-1 lg:gap-2.5">
        <div className="flex h-10 w-full items-end gap-3">
          <div className="flex h-10 flex-1 items-center gap-1.5 rounded-md border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2">
            <img alt="" className="size-5 shrink-0" src={imgSearch} />
            <input
              type="text"
              value={location}
              onChange={(e) => onLocationChange?.(e.target.value)}
              placeholder="Zoek op locatie"
              className="w-full flex-1 bg-transparent text-sm text-[#161412] placeholder:text-black/60 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onUseMyLocation}
            aria-label="Gebruik mijn locatie"
            className="flex h-10 w-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#99c066] bg-[#99c066] p-2 text-sm font-medium uppercase text-black lg:w-auto lg:px-4"
          >
            <img alt="" className="size-4 shrink-0" src={imgMyLocation} />
            <span className="hidden lg:inline">Gebruik mijn locatie</span>
          </button>
        </div>

        {/* Mobile only: Selects live here, stacked full-width (desktop shows them in the right column) */}
        <div className="flex w-full flex-col gap-3 lg:hidden">
          <Select label="Merk" value={brand} onChange={onBrandChange} options={brandOptions} />
          <Select label="Specialisatie" value={specialty} onChange={onSpecialtyChange} options={specialtyOptions} />
          <div className="flex w-full items-start gap-1.5">
            <img alt="" className="size-4 shrink-0" src={imgInfo} />
            <p className="min-w-0 flex-1 text-xs text-[#161412]">Filter op merk of specialisatie beschikbaar in de showroom.</p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
          <div className="flex shrink-0 items-center gap-3">
            
            <label className="flex items-center gap-2 text-sm text-black">
              <Switch checked={filterEnabled} onChange={filterToggleChanged} />
              Toon enkel
            </label>

            <span className="flex h-6 items-center justify-center rounded-full bg-[#161412] px-2 py-0.5 text-sm font-semibold text-white">
              XL Store
            </span>
          
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <img alt="" className="size-4 shrink-0" src={imgInfo} />
            <p className="min-w-0 text-xs text-[#161412]">Wat is een XL Store?</p>
          </div>
        </div>
      </div>

      {/* Desktop only: the two Selects side-by-side in their own column */}
      <div className="hidden w-[400px] shrink-0 flex-col gap-2.5 lg:flex">
        <div className="flex w-full items-center gap-3">
          <Select label="Merk" value={brand} onChange={onBrandChange} options={brandOptions} />
          <Select label="Specialisatie" value={specialty} onChange={onSpecialtyChange} options={specialtyOptions} />
        </div>
        <div className="flex items-center gap-1">
          <img alt="" className="size-4 shrink-0" src={imgInfo} />
          <p className="text-xs text-[#161412]">Filter op merk of specialisatie beschikbaar in de showroom.</p>
        </div>
      </div>
    </div>
  );
}
