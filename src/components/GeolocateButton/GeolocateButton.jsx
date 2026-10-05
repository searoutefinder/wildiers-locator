import { useCallback, useEffect, useRef, useState } from "react";
import { useStoreLocator } from "../../context/StoreLocatorContext";

// Helpers

// HTML5 Geolocation wrapped in a Promise
const getCurrentPosition = (options) =>
  new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(Object.assign(new Error("Geolocation is not supported"), { code: "UNSUPPORTED" }));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
 
// Mapbox Geocoding v6 reverse lookup -> address string (or null if nothing found)
const reverseGeocode = async ([lng, lat], { accessToken, language, signal }) => {
  const params = new URLSearchParams({
    longitude: String(lng),
    latitude: String(lat),
    language,
    limit: "1",
    access_token: accessToken,
  });
 
  const res = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?${params}`, { signal });
  if (!res.ok) throw new Error(`Reverse geocoding failed (${res.status})`);
 
  const json = await res.json();
  const props = json.features?.[0]?.properties;
  return props?.full_address ?? props?.name ?? null;
};
 
// Human-readable (Dutch) messages for the possible failures
const errorMessage = (err) => {
  switch (err?.code) {
    case 1: return "Toegang tot je locatie is geweigerd.";            // PERMISSION_DENIED
    case 2: return "Je locatie kon niet bepaald worden.";             // POSITION_UNAVAILABLE
    case 3: return "Het bepalen van je locatie duurde te lang.";      // TIMEOUT
    case "UNSUPPORTED": return "Je browser ondersteunt geen locatiebepaling.";
    default: return "Er ging iets mis bij het bepalen van je locatie.";
  }
};

export const useGeolocate = ({
  accessToken,
  language = "nl",
  fallbackText = "Mijn locatie",
  geolocationOptions = { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
} = {}) => {
  const { setLocation } = useStoreLocator();
 
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
 
  const abortRef = useRef(null);
 
  // Cancel a pending reverse geocoding request when the component unmounts
  useEffect(() => () => abortRef.current?.abort(), []);
 
  const locate = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
 
    setStatus("loading");
    setError(null);
 
    let coordinates;
 
    // 1. Position
    try {
      const pos = await getCurrentPosition(geolocationOptions);
      coordinates = [pos.coords.longitude, pos.coords.latitude]; // GeoJSON order: [lng, lat]
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(errorMessage(err));
      setStatus("error");
      return;
    }
 
    // 2. Address (best effort)
    let text = fallbackText;
    try {
      text = (await reverseGeocode(coordinates, { accessToken, language, signal: controller.signal })) ?? fallbackText;
    } catch (err) {
      if (controller.signal.aborted) return;
      console.warn(err); // keep the coordinates, only the address is missing
    }
 
    if (controller.signal.aborted) return;
 
    // 3. Store in context
    setLocation({ text, coordinates });
    setStatus("success");
  }, [accessToken, language, fallbackText, geolocationOptions, setLocation]);
 
  return { locate, status, error };
};

const GeolocateButton = ({ accessToken = import.meta.env.VITE_MAPBOX_TOKEN, className = "" }) => {
  
    const { locate, status, error } = useGeolocate({ accessToken });
  const loading = status === "loading";
 
  return (    
    <button
      type="button"
      onClick={locate}
      disabled={loading}
      aria-label="Gebruik mijn locatie"
      aria-busy={loading}
      title={error ?? undefined}
      className="cursor-pointer flex h-10 w-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#99c066] bg-[#99c066] p-2 text-sm font-medium uppercase text-black lg:w-auto lg:px-4"
    >
      <img 
        alt=""
        className={`size-4 shrink-0 ${loading ? "animate-pulse" : ""}`}
        src="/icons/material-symbols/my_location.svg" 
      />
      <span className="hidden lg:inline">
        {loading ? "Locatie zoeken…" : "Gebruik mijn locatie"}
      </span>
    </button>    
  );  
}

export default GeolocateButton;