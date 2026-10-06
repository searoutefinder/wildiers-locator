import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import StoreCard from "./StoreCard";


import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import StoreLayer from './Layers/StoreLayer';
import StorePopup from "./StorePopup/StorePopup";

import { useStoreLocator } from "../context/StoreLocatorContext";


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
 * @param {{id:string|number, number:number, color?: 'black'|'green', xl?: boolean, xPct:number, yPct:number, storeId?: string|number}[]} stores - desktop marker layout (888×956 canvas)
 * @param {Object} [selectedStore] - store to show in the desktop floating detail card
 * @param {{id:string|number, number:number, color?: 'black'|'green', xl?: boolean, xPct:number, yPct:number, storeId?: string|number}[]} [mobileMarkers] - mobile marker layout (375×668 canvas) — the mobile mock uses a different map crop/zoom than desktop, so positions aren't shared
 * @param {Object[]} [carouselStores] - stores shown in the mobile horizontal carousel (set `highlighted` on the selected one)
 */
export default function MapPanel ({ bottomInset = 0, showPopup = true }) {

  mapboxgl.accessToken    = import.meta.env.VITE_MAPBOX_TOKEN;

  // Refs
  const mapContainerRef   = useRef(null);
  const mapRef            = useRef(null);
  const map               = mapRef.current;

  // Context
  const { stores, selectedStore, resultBounds, initialLoad, setInitialLoad } = useStoreLocator();

  // State
  const [mapReady, setMapReady] = useState(false);  

  // Refs

  const popupNodeRef = useRef(document.createElement("div"));
  const popupRef = useRef(null);  

  useEffect(() => {
    if(!map) { return; }
    if(!resultBounds) { return; }
    if(initialLoad) {
      setInitialLoad(false);
      return;
    }
    map.fitBounds(resultBounds, {
      padding: { top: 60, right: 60, left: 60, bottom: 60 + bottomInset },
      maxZoom: 17,
      duration: 1000,
      essential: true,
    });    
    
  }, [resultBounds]);

  useEffect(() => {
    
    if (mapRef.current) return
    if (!mapContainerRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/tamh/cmugnsq12003501s8cl0r2v8n',
      bounds: [[2.51, 49.50],[6.41, 51.51]],
      zoom: 9,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();

    mapRef.current = map;

    map.on('load', () => setMapReady(true));

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };

  }, []); 

  useEffect(() => {
    if (selectedStore?.id == null || selectedStore?.source !== "list") return;

    const map = mapRef.current;
    const feature = stores.features.find((f) => f.properties.id === selectedStore?.id);
    if (!map || !feature) return;


      map.flyTo({
        center: feature.geometry.coordinates,
        zoom: Math.max(map.getZoom(), 14),
        offset: [0, -bottomInset / 2],
        essential: true,
      });      
  }, [selectedStore]);  



  return (
    <>
      {/* Desktop: inset map with numbered markers + floating detail card */}
      <div className="store-map relative h-full w-full overflow-clip lg:rounded-lg" style={{ "--map-bottom-inset": `${bottomInset}px` }}>
        <div ref={mapContainerRef} className="absolute inset-0 h-full" />
          {
            mapReady && map && (
              <>
                <StoreLayer map={map} stores={stores}></StoreLayer>
                {showPopup && <StorePopup map={map} />}
              </>          
            )
          }    
      </div>
    </>
  );
}
