import {
  imgMapBackground1,
  imgMapBackground2,
  imgMobileMapBackground1,
  imgMobileMapBackground2,
  imgAdd2,
  imgRemove,
  imgMapModalArrow,
  imgStoreIconDark,
  imgStoreIconLight,
} from "../assets";
import StoreCard from "./StoreCard";

/**
 * Numbered store marker ("Store Icon" in Figma).
 * color: "black" (default) | "green" (the currently highlighted/selected store)
 */
function StoreMarker({ number, color = "black", xl, style, onClick }) {
  const isGreen = color === "green";
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`absolute flex h-8 items-center justify-center gap-1 rounded-full px-2 py-[3px] shadow-[0px_12px_8px_rgba(0,0,0,0.08),0px_4px_3px_rgba(0,0,0,0.03)] ${
        isGreen ? "bg-[#99c066]" : "bg-[#161412]"
      }`}
    >
      <p className={`text-base font-semibold ${isGreen ? "text-[#161412]" : "text-white"}`}>{number}</p>
      <img alt="" className="size-4" src={isGreen ? imgStoreIconDark : imgStoreIconLight} />
      {xl && <span className={`pt-0.5 text-xs font-semibold ${isGreen ? "text-[#161412]" : "text-white"}`}>XL</span>}
    </button>
  );
}

/**
 * Zoom control, shared between the desktop and mobile map layouts.
 */
function ZoomControls({ onZoomIn, onZoomOut, className, style }) {
  return (
    <div style={style} className={`flex flex-col drop-shadow-[0px_12px_8px_rgba(0,0,0,0.08),0px_4px_3px_rgba(0,0,0,0.03)] ${className}`}>
      <button
        type="button"
        onClick={onZoomIn}
        aria-label="Zoom in"
        className="flex size-9 items-center justify-center rounded-t-md border border-[#e7e5e4] bg-white"
      >
        <img alt="" className="size-4" src={imgAdd2} />
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        aria-label="Zoom uit"
        className="flex size-9 items-center justify-center rounded-b-md border border-[#e7e5e4] bg-white"
      >
        <img alt="" className="size-4" src={imgRemove} />
      </button>
    </div>
  );
}

/**
 * Map panel with store markers ("Map Box" in Figma).
 *
 * This is two different layouts, switched with `lg:` (matching the 1280px
 * desktop master vs. the 375px "Breakpoint=Mobile" frame):
 *
 * - Desktop: an inset map (888×956 aspect) with numbered markers and a
 *   floating detail card for the selected store.
 * - Mobile: a full-bleed map (375×668 aspect — render this edge-to-edge, e.g.
 *   with a `-mx-5` wrapper, since the section around it still has side padding)
 *   with its own marker layout, topped by a horizontal-scrolling strip of
 *   store cards ("Store Card", 180px each) faded in over the bottom of the
 *   map — this replaces the desktop's separate sidebar list.
 *
 * Both are static screenshots standing in for the real map — wire up your
 * actual Mapbox GL JS instance and keep the marker/popup/carousel markup (or
 * Code Connect it to your own Marker/Popup components), dropping the
 * `imgMapBackground*` / `imgMobileMapBackground*` images once the live map renders.
 *
 * @param {{id:string|number, number:number, color?: 'black'|'green', xl?: boolean, xPct:number, yPct:number, storeId?: string|number}[]} markers - desktop marker layout (888×956 canvas)
 * @param {Object} [selectedStore] - store to show in the desktop floating detail card
 * @param {{id:string|number, number:number, color?: 'black'|'green', xl?: boolean, xPct:number, yPct:number, storeId?: string|number}[]} [mobileMarkers] - mobile marker layout (375×668 canvas) — the mobile mock uses a different map crop/zoom than desktop, so positions aren't shared
 * @param {Object[]} [carouselStores] - stores shown in the mobile horizontal carousel (set `highlighted` on the selected one)
 */
export default function MapPanel({
  markers = [],
  selectedStore,
  mobileMarkers = [],
  carouselStores = [],
  onMarkerClick,
  onZoomIn,
  onZoomOut,
}) {
  return (
    <>
      {/* Desktop: inset map with numbered markers + floating detail card */}
      <div className="relative hidden h-full w-full overflow-clip rounded-lg lg:block">
        <div className="absolute inset-0 bg-[#FF0000]">

        </div>

        
      </div>

      {/* Mobile: full-bleed map + horizontal store-card carousel overlaid on the fade at its bottom edge */}
      <div className="w-full lg:hidden">
        <div className="relative aspect-[375/668] w-full overflow-clip">
          <div className="absolute inset-0">
            <img alt="" className="absolute inset-0 size-full object-cover" src={imgMobileMapBackground1} />
            <img alt="" className="absolute inset-0 size-full object-cover" src={imgMobileMapBackground2} />
          </div>

          {mobileMarkers.map((m) => (
            <StoreMarker
              key={m.id}
              number={m.number}
              color={m.color}
              xl={m.xl}
              style={{ left: `${m.xPct}%`, top: `${m.yPct}%` }}
              onClick={() => onMarkerClick?.(m)}
            />
          ))}

          <ZoomControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} className="absolute right-5" style={{ top: "55.5%" }} />
        </div>

        {carouselStores.length > 0 && (
          <div className="relative -mt-[140px] flex flex-col bg-gradient-to-b from-transparent to-white px-4 pb-4 pt-10">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {carouselStores.map((store) => (
                <StoreCard key={store.id} store={store} size="carousel" />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
