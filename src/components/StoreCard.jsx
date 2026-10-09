import {
  imgStore,
  imgStoreThumb2,
} from "../assets";

import { t } from '../i18n';

const tagStyles = {
  "ebike": { text: "E-bike", bg: "bg-[#ebf2e0]", icon: "/icons/material-symbols/electric_bike.svg" },
  "sport": { text: "Sport", bg: "bg-[#ffe6e6]", icon: "/icons/material-symbols/directions_bike.svg" },
  "cargo": { text: "Cargo", bg: "bg-[#e7e5e4]", icon: "/icons/material-symbols/bike_scooter.svg" },
};

const TagsBadge = ({ tag }) => {
  const style = tagStyles[tag] ?? tagStyles.cargo;
  return (
    <div className={`flex shrink-0 items-center justify-center gap-1 rounded-lg px-1 ${style.bg}`}>
      <img alt="" className="size-3" src={style.icon} />
      <p className="whitespace-nowrap text-xs text-[#161412]">{style.text}</p>
    </div>
  );
}

const TagsBadgeRow = ({ tags }) => {
  if (!tags?.length) return null;
  return (
    <div className="flex w-full flex-wrap items-start gap-1">
      {tags.map((t) => (
        <TagsBadge key={t} tag={t} />
      ))}
    </div>
  );
}

const NumberBadge = ({ number, highlighted, compact }) => {
  return (
    <div className="absolute left-0 top-0">
      {/* Ferde sarok-háromszög */}
      <div
        className={`absolute left-0 top-0 h-0 w-0 border-r-transparent ${
          compact ? "border-t-[60px] border-r-[60px]" : "border-t-[80px] border-r-[80px]"
        } ${highlighted ? "border-t-[#99c066]" : "border-t-[#000]"}`}
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

const OpeningHours = ({ status, statusDetail }) => {
  if (!status) return null;
  
  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      <p className={`text-xs font-medium ${status === "open" ? "text-[#7a9a52]" : "text-[#c62828]"}`}>
        {status === "open" ? t("storeOpen") : t("storeClosed")}
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

const Distance = ({ distanceKm }) => {
  if (typeof distanceKm !== "number") return null;
  return (
    <div className="flex shrink-0 gap-1">
      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#d6e6c2]">
        <img alt="" className="size-3" src="/icons/material-symbols/pin_drop.svg" />
      </div>
      <p className="whitespace-nowrap text-xs text-[#161412]">{distanceKm.toFixed(1)} km from you</p>
    </div>
  );
}

const getOpeningTimeForToday = (obj, timeZone = "Europe/Brussels") => {
  if (!obj) return undefined;

  const key = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone })
    .format(new Date())
    .toLowerCase();

  return obj[key];
}

const StoreCard = ({ store, size = "default", onRoutePlan, onTestRide, onLink, onClick }) => {
  const isSmall = size === "small";
  const isCarousel = size === "carousel";
  const showActions = size === "default";

  const {
    thumbnailOverlay = imgStoreThumb2,
    distance_km,
    highlighted,
    opening_times
  } = store;

  const xlStore = store.is_xl_store;
  const name = store.name;

  const highlightedShadow = isCarousel
    ? "shadow-[0px_20px_24px_-4px_rgba(0,0,0,0.08),0px_8px_8px_-4px_rgba(0,0,0,0.03)]"
    : "shadow-[0_12px_16px_-4px_rgba(0,0,0,0.08),0_4px_6px_-2px_rgba(0,0,0,0.03)]";

  const onClickHandler = (e) => {
    onClick(e, store);
  }

  const onRouteHandler = (e) => {
    onRoutePlan(e, store);
  } 
  
  const onLinkHandler = (e) => {
    onLink(e, store);
  }
  return (
    <div
      onClick={isSmall ? onLinkHandler : onClickHandler}
      className={`cursor-pointer relative flex flex-col items-start gap-4 rounded-lg border-solid bg-white 
        ${ isCarousel ? "w-[180px] shrink-0" : "w-full min-w-0" } 
        ${ highlighted
          ? `border-2 border-[#99c066] bg-gradient-to-r from-[#ebf2e0]/50 to-[#ebf2e0]/50 ${highlightedShadow}`
          : "border border-[#d6d3d1]"
        }
        ${ isSmall || isCarousel ? "overflow-clip" : ""}` }
    >
      <div className={`relative flex w-full items-start overflow-clip rounded-t-md ${isSmall ? "h-[100px]" : "h-[130px]"}`}>
        
        <div className="relative h-full flex-1">
          <img alt={name} className="absolute inset-0 size-full object-cover" src={store.images[0]} />
          {thumbnailOverlay && <img alt="" className="absolute inset-0 size-full object-cover" src={store.images[0]} />}
        </div>

        <NumberBadge 
          number={store.store_num_id} 
          highlighted={highlighted} 
          compact={isSmall} 
        />
        

          <button
            type="button"
            onClick={onLinkHandler}
            aria-label="Bekijk winkel"
            className="
            cursor-pointer
              absolute
              right-[5px]
              top-[5px]
              flex size-7
              items-center
              justify-center
              rounded-md
              border
              border-[#e7e5e4]
              bg-white
            "
          >
            <img alt="" className="size-4" src="/icons/material-symbols/arrow_outward.svg" />
          </button>

      </div>

      <div className="flex w-full min-w-0 flex-col gap-4 px-4 pb-4">
        <div className="flex w-full min-w-0 flex-col gap-3">

          <div className="flex w-full min-w-0 gap-2 items-center">
            <button
              onClick={onLinkHandler} 
              className="cursor-pointer block max-w-full truncate text-sm font-medium text-[#161412] underline"
            >
              {name}
            </button>
            {xlStore && isSmall ? (
              <div className="flex h-6 shrink-0 items-center justify-center gap-1 rounded-full bg-[#161412] px-2 py-0.5">
                <img alt="" className="size-4" src="/icons/material-symbols/store-white.svg" />
                <p className="whitespace-nowrap text-sm font-semibold text-white">                  
                  XL
                </p>
              </div>
            ) : xlStore ? (
              <div className="flex h-6 shrink-0 items-center justify-center gap-1 rounded-full bg-[#161412] px-2 py-0.5">
                <p className="whitespace-nowrap text-sm font-semibold text-white">XL Store</p>
              </div>
            ) : ('')}            
          </div>

          <div className="flex items-center gap-2">
            {distance_km && <Distance distanceKm={distance_km} />}
            <OpeningHours
              status={getOpeningTimeForToday(opening_times) !== "gesloten" ? "open" : "gesloten"}
              statusDetail={getOpeningTimeForToday(opening_times)} 
            />
          </div>          
          
        </div>

        <TagsBadgeRow tags={store.tags} />

        {showActions && (

          
          <div className="flex w-full items-start gap-2">
            <button
              type="button"
              onClick={onRouteHandler}
              className="cursor-pointer flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-[#e7e5e4] bg-white px-4 py-2"
            >
              <img alt="" className="size-4" src="/icons/material-symbols/pin_drop.svg" />
              <span className="whitespace-nowrap text-base text-black">{t("directionsBtnText")}</span>
            </button>
            <button
              type="button"
              onClick={onTestRide}
              className="cursor-pointer flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-[#99c066] bg-[#99c066] px-4 py-2"
            >
              <img alt="" className="size-4" src="/icons/material-symbols/directions_bike.svg" />
              <span className="whitespace-nowrap text-base text-black">{t("testRideBtnText")}</span>
            </button>
          </div>

        )}

      </div>
    </div>
  );
}

export default StoreCard;

export { imgStore };
