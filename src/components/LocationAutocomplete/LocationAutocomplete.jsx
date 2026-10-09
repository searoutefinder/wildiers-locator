import { useEffect, useId, useRef, useState } from "react";
import { useStoreLocator } from "../../context/StoreLocatorContext";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MIN_CHARS = 3;
const DEBOUNCE_MS = 250;

const formatLabel = (feature) => {
  const p = feature.properties;
  const ctx = p.context ?? {};
  const street = p.feature_type === "address" ? p.name : ctx.address?.name ?? p.name;
  const city = ctx.place?.name ?? ctx.locality?.name;
  const postcode = ctx.postcode?.name;
  const parts = [street, city, postcode].filter(Boolean);
  // duplikáció elkerülése, ha városra keresett (name === place)
  return [...new Set(parts)].join(", ") || p.full_address;
};
 
const LocationAutocomplete = ({ placeholder = "Zoek op locatie", onLocationChange }) => {
 
  const { location, setLocation } = useStoreLocator();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const skipNextFetch = useRef(false);
  const listId = useId();
 
  
  useEffect(() => {
    if (location == null) {
      setQuery("");
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }, [location]);

  // Query with debounce, breaking the former query
  useEffect(() => {

    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    if (query.trim().length < MIN_CHARS) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
 
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      const params = new URLSearchParams({
        q: query,
        autocomplete: "true",
        limit: "3",
        country: "be",
        language: "nl",
        access_token: MAPBOX_TOKEN,
      });
      try {
        const res = await fetch(
          `https://api.mapbox.com/search/geocode/v6/forward?${params}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
        const json = await res.json();
        const items = json.features.map((f) => ({
          id: f.id ?? f.properties.mapbox_id,
          text: formatLabel(f),
          coordinates: [f.properties.coordinates.longitude, f.properties.coordinates.latitude],
        }));
        setSuggestions(items);
        setActiveIndex(-1);
        setIsOpen(items.length > 0);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    }, DEBOUNCE_MS);
 
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
 
  const select = (item) => {
    console.log(item)
    skipNextFetch.current = true; // a kiválasztott szöveg beírása ne indítson új keresést
    setQuery(item.text);
    onLocationChange({ text: item.text, coordinates: item.coordinates });
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };
 
  const onKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        break;
      case "Enter":
        if (activeIndex >= 0) {
          e.preventDefault();
          select(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };
 
  return (
    <div className="relative flex h-10 flex-1 items-center gap-1.5 rounded-md border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2">
      <img alt="" className="size-5 shrink-0" src="/icons/material-symbols/search.svg" />
 
      <input
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full flex-1 bg-transparent text-sm text-[#161412] placeholder:text-black/60 focus:outline-none"
      />
 
      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-[#e7e5e4] bg-white shadow-md"
        >
          {suggestions.map((item, i) => (
            <li
              key={item.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              // onMouseDown: az input blur-je előtt fut le, így a lista nem zárul be a kattintás előtt
              onMouseDown={(e) => {
                e.preventDefault();
                select(item);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`cursor-pointer px-3 py-2 text-sm text-[#161412] ${
                i === activeIndex ? "bg-[#f5f5f4]" : ""
              }`}
            >
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationAutocomplete;