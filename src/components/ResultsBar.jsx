import { imgMapPin, imgCloseSmall, imgCloseSmallOutline } from "../assets";

function Chip({ label, onRemove }) {
  return (
    <div className="flex h-7 shrink-0 items-center justify-center gap-0.5 rounded-md bg-[#e7e5e4] px-2">
      <p className="leading-none whitespace-nowrap text-sm text-[#161412]">{label}</p>
      <button type="button" onClick={onRemove} aria-label={`${label} verwijderen`} className="flex items-center">
        <img alt="" className="size-5" src={imgCloseSmall} />
      </button>
    </div>
  );
}

/**
 * "12 winkels gevonden" row with the active-filter chips ("Filters wissen" bar in Figma).
 *
 * Desktop (`lg:`, 1280px master): one row — count, then the chip groups inline
 * separated by dividers, then "Filters wissen" on the far right.
 * Mobile (base, 375px "Breakpoint=Mobile" frame): count + "Filters wissen" share
 * a top row (`justify-between`, no dividers), and the chip groups move to their
 * own stacked block underneath.
 */
export default function ResultsBar({ resultCount, locationLabel, onRemoveLocation, activeFilters = [], onRemoveFilter, onClearAll }) {
  const hasChips = Boolean(locationLabel) || activeFilters.length > 0;

  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-lg bg-[#fafaf9] px-1 py-2">
      <div className="flex w-full items-center justify-between gap-4 lg:justify-normal">
        <div className="flex shrink-0 items-center gap-1.5">
          <img alt="" className="size-4" src={imgMapPin} />
          <p className="whitespace-nowrap text-base font-semibold text-[#161412]">{resultCount} winkels gevonden</p>
        </div>

        {/* Desktop only: chip groups inline with dividers, between the count and "Filters wissen" */}
        <div className="hidden min-w-0 flex-1 items-center gap-8 lg:flex">
          {locationLabel && (
            <>
              <div className="h-7 w-px shrink-0 bg-[#e7e5e4]" />
              <div className="flex shrink-0 items-center gap-2">
                <p className="whitespace-nowrap text-sm text-[#161412]">Zoekgebied:</p>
                <Chip label={locationLabel} onRemove={onRemoveLocation} />
              </div>
            </>
          )}

          {activeFilters.length > 0 && (
            <>
              <div className="h-7 w-px shrink-0 bg-[#e7e5e4]" />
              <div className="flex shrink-0 items-center gap-2">
                <p className="whitespace-nowrap text-sm text-[#161412]">Resultaten voor:</p>
                {activeFilters.map((f) => (
                  <Chip key={f} label={f} onRemove={() => onRemoveFilter?.(f)} />
                ))}
              </div>
            </>
          )}
        </div>

        <button type="button" onClick={onClearAll} className="flex shrink-0 items-center gap-2">
          <span className="whitespace-nowrap text-sm text-[#161412] underline">Filters wissen</span>
          <img alt="" className="size-4" src={imgCloseSmallOutline} />
        </button>
      </div>

      {/* Mobile only: chip groups stacked below the top row, no dividers */}
      {hasChips && (
        <div className="flex w-full flex-col items-start gap-2 lg:hidden">
          {locationLabel && (
            <div className="flex flex-wrap items-center gap-2">
              <p className="whitespace-nowrap text-sm text-[#161412]">Zoekgebied:</p>
              <Chip label={locationLabel} onRemove={onRemoveLocation} />
            </div>
          )}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <p className="whitespace-nowrap text-sm text-[#161412]">Resultaten voor:</p>
              {activeFilters.map((f) => (
                <Chip key={f} label={f} onRemove={() => onRemoveFilter?.(f)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
