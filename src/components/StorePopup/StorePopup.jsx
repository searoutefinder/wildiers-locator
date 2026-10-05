import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";
import StoreCard from "../StoreCard";
import { useStoreLocator } from "../../context/StoreLocatorContext";

const StorePopup = ({ map }) => {
  const { stores, selectedId, setSelectedId } = useStoreLocator();

  const nodeRef = useRef(document.createElement("div"));
  const popupRef = useRef(null);

  // Popup létrehozása egyszer, a map megjelenésekor
  useEffect(() => {
    const popup = new mapboxgl.Popup({
      offset: 20,
      maxWidth: "360px",
      closeOnClick: false,
      closeButton: false,
      className: "store-popup",
    }).setDOMContent(nodeRef.current);

    popup.on("close", () => setSelectedId(null));
    popupRef.current = popup;

    return () => popup.remove();
  }, [map, setSelectedId]);

  const selectedStore = useMemo(
    () => stores.features.find((f) => f.properties.id === selectedId) ?? null,
    [stores, selectedId]
  );

  // Nyitás / mozgatás / zárás a kiválasztás alapján
  useEffect(() => {
    const popup = popupRef.current;
    if (!popup) return;

    if (!selectedStore) {
      if (popup.isOpen()) popup.remove();
      return;
    }

    popup.setLngLat(selectedStore.geometry.coordinates);
    if (!popup.isOpen()) popup.addTo(map);
  }, [map, selectedStore]);

  if (!selectedStore) return null;

  return createPortal(
    <StoreCard 
      store={selectedStore.properties} 
      size="small" 
    />,
    nodeRef.current
  );
};

export default StorePopup;