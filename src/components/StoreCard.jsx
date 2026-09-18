import {
  imgLeftTop,
  imgLeftTopHighlighted,
  imgPinDrop,
  imgElectricBike,
  imgDirectionsBike,
  imgBikeScooter,
  imgPinDropOutline,
  imgDirectionsBikeOutline,
  imgStore,
  imgArrowOutward,
  imgStoreThumb1,
  imgStoreThumb2,
} from "../assets";

/**
 * A single Wildiers store result.
 *
 * @typedef {Object} Store
 * @property {string|number} id
 * @property {string} name
 * @property {string} [thumbnail]
 * @property {string} [thumbnailOverlay]
 * @property {number} number          - marker number shown on the badge / map pin
 * @property {boolean} [xlStore]
 * @property {number} [distanceKm]
 * @property {'open'|'closed'} [status]
 * @property {string} [statusDetail]  - e.g. "tot 18:00" or "opent morgen om 09:00"
 * @property {string[]} [types]       - e.g. ["E-bike", "Sport", "Cargo"]
 * @property {boolean} [highlighted]  - selected/active state (green border + tinted bg + light ribbon)
 */

const typeStyles = {
  "E-bike": { bg: "bg-[#ebf2e0]", icon: imgElectricBike },
  Sport: { bg: "bg-[#ffe6e6]", icon: imgDirectionsBike },
  Cargo: { bg: "bg-[#e7e5e4]", icon: imgBikeScooter },
};

function TypeBadge({ label }) {
  const style = typeStyles[label] ?? typeStyles.Cargo;
  return (
    <div className={`flex shrink-0 items-center justify-center gap-1 rounded-lg px-1 ${style.bg}`}>
      <img alt="" className="size-3" src={style.icon} />
      <p className="whitespace-nowrap text-xs text-[#161412]">{label}</p>
    </div>
  );
}

function TypeBadgeRow({ types }) {
  if (!types?.length) return null;
  return (
    <div className="flex w-full flex-wrap items-start gap-1">
      {types.map((t) => (
        <TypeBadge key={t} label={t} />
      ))}
    </div>
  );
}

/**
 * Number-badge ribbon in the thumbnail's top-left corner.
 * `compact` shrinks the ribbon (60px) and pulls the number in for the
 * small "province grid" card — the default/carousel cards use the 80px ribbon.
 */
function NumberBadge({ number, highlighted, compact }) {
  return (
    <div className="absolute left-0 top-0">
      {/* Ferde sarok-háromszög */}
      <div
        className={`absolute left-0 top-0 h-0 w-0 border-r-transparent ${
          compact ? "border-t-[60px] border-r-[60px]" : "border-t-[80px] border-r-[80px]"
        } ${highlighted ? "border-t-[#99c066]" : "border-t-[#3f6212]"}`}
      />
      {/* Szám */}
      <div
        className={`absolute flex size-6 items-center justify-center ${
          compact ? "left-1.5 top-1.5" : "left-[9px] top-[11px]"
        }`}
      >
        <p className={`text-base font-semibold ${highlighted ? "text-[#161412]" : "text-white"}`}>
          {number}
        </p>
      </div>
    </div>
  );
}

function OpeningHours({ status, statusDetail }) {
  if (!status) return null;
  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      <p className={`text-xs font-medium ${status === "open" ? "text-[#7a9a52]" : "text-[#c62828]"}`}>
        {status === "open" ? "Open" : "Gesloten"}
      </p>
      {statusDetail && (
        <>
          <p className="text-xs text-[#78726c]">•</p>
          <p className="min-w-0 flex-1 truncate text-xs text-[#78726c]">{statusDetail}</p>
        </>
      )}
    </div>
  );
}

function Distance({ distanceKm }) {
  if (typeof distanceKm !== "number") return null;
  return (
    <div className="flex shrink-0 gap-1">
      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#d6e6c2]">
        <img alt="" className="size-3" src={imgPinDrop} />
      </div>
      <p className="whitespace-nowrap text-xs text-[#161412]">{distanceKm} km from you</p>
    </div>
  );
}

/**
 * Store card — matches the Figma "Store Card" component.
 *
 * size="default"  → wide card used in the sidebar list / map popup (full detail + buttons)
 * size="carousel" → fixed 180px card used in the mobile map's horizontal store carousel (no buttons)
 * size="small"    → compact card used in the province grid (no distance, corner expand button)
 */
export default function StoreCard({ store, size = "default", onRoutePlan, onTestRide, onExpand }) {
  const isSmall = size === "small";
  const isCarousel = size === "carousel";
  const showDistance = !isSmall;
  const showActions = size === "default";

  const {
    name,
    thumbnail = imgStoreThumb1,
    thumbnailOverlay = imgStoreThumb2,
    number,
    xlStore,
    distanceKm,
    status,
    statusDetail,
    types = [],
    highlighted,
  } = store;

  const highlightedShadow = isCarousel
    ? "shadow-[0px_20px_24px_-4px_rgba(0,0,0,0.08),0px_8px_8px_-4px_rgba(0,0,0,0.03)]"
    : "shadow-[0_12px_16px_-4px_rgba(0,0,0,0.08),0_4px_6px_-2px_rgba(0,0,0,0.03)]";

  return (
    <div
      className={`relative flex flex-col items-start gap-4 rounded-lg border-solid bg-white ${
        isCarousel ? "w-[180px] shrink-0" : "w-full min-w-0"
      } ${
        highlighted
          ? `border-2 border-[#99c066] bg-gradient-to-r from-[#ebf2e0]/50 to-[#ebf2e0]/50 ${highlightedShadow}`
          : "border border-[#d6d3d1]"
      } ${isSmall || isCarousel ? "overflow-clip" : ""}`}
    >
      <div className={`relative flex w-full items-start overflow-clip rounded-t-md ${isSmall ? "h-[100px]" : "h-[130px]"}`}>
        <div className="relative h-full flex-1">
          <img alt={name} className="absolute inset-0 size-full object-cover" src={thumbnail} />
          {thumbnailOverlay && <img alt="" className="absolute inset-0 size-full object-cover" src={thumbnailOverlay} />}
        </div>
        <NumberBadge number={number} highlighted={highlighted} compact={isSmall} />
        {isSmall && (
          <button
            type="button"
            onClick={onExpand}
            aria-label="Bekijk winkel"
            className="absolute right-[5px] top-[5px] flex size-7 items-center justify-center rounded-md border border-[#e7e5e4] bg-white"
          >
            <img alt="" className="size-4" src={imgArrowOutward} />
          </button>
        )}
      </div>

      <div className="flex w-full min-w-0 flex-col gap-4 px-4 pb-4">
        <div className="flex w-full min-w-0 flex-col gap-3">
          <div className="flex w-full min-w-0 gap-2 items-center">
            <a href="#" className="block max-w-full truncate text-sm font-medium text-[#161412] underline">
              {name}
            </a>
            {xlStore && (
              <div className="flex h-6 shrink-0 items-center justify-center gap-1 rounded-full bg-[#161412] px-2 py-0.5">
                <p className="whitespace-nowrap text-sm font-semibold text-white">XL Store</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showDistance && <Distance distanceKm={distanceKm} />}
            <OpeningHours status={status} statusDetail={statusDetail} />
          </div>          
          
        </div>

        <TypeBadgeRow types={types} />

        {showActions && (
          <div className="flex w-full items-start gap-2">
            <button
              type="button"
              onClick={onRoutePlan}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-[#e7e5e4] bg-white px-4 py-2"
            >
              <img alt="" className="size-4" src={imgPinDropOutline} />
              <span className="whitespace-nowrap text-base text-black">Route plannen</span>
            </button>
            <button
              type="button"
              onClick={onTestRide}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-[#99c066] bg-[#99c066] px-4 py-2"
            >
              <img alt="" className="size-4" src={imgDirectionsBikeOutline} />
              <span className="whitespace-nowrap text-base text-black">Plan je testrit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Re-exported so other components (e.g. the "Toon alle winkels" button) can share the icon.
export { imgStore };
