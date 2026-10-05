import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  imgMobileMapBackground1,
  imgMobileMapBackground2,
  imgAdd2,
  imgRemove,
  imgStoreIconDark,
  imgStoreIconLight,
} from "../assets";
import StoreCard from "./StoreCard";

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import StoreLayer from './Layers/StoreLayer';

import { useStoreLocator } from "../context/StoreLocatorContext";


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
 * @param {{id:string|number, number:number, color?: 'black'|'green', xl?: boolean, xPct:number, yPct:number, storeId?: string|number}[]} stores - desktop marker layout (888×956 canvas)
 * @param {Object} [selectedStore] - store to show in the desktop floating detail card
 * @param {{id:string|number, number:number, color?: 'black'|'green', xl?: boolean, xPct:number, yPct:number, storeId?: string|number}[]} [mobileMarkers] - mobile marker layout (375×668 canvas) — the mobile mock uses a different map crop/zoom than desktop, so positions aren't shared
 * @param {Object[]} [carouselStores] - stores shown in the mobile horizontal carousel (set `highlighted` on the selected one)
 */
export default function MapPanel ({
  mobileMarkers = [],
  carouselStores = [],
  onZoomIn,
  onZoomOut,
}) {

  mapboxgl.accessToken    = import.meta.env.VITE_MAPBOX_TOKEN;

  // Refs
  const mapContainerRef   = useRef(null);
  const mapRef            = useRef(null);
  const map               = mapRef.current;

  // Context
  const { stores, selectedId, setSelectedId, resultBounds, initialLoad, setInitialLoad } = useStoreLocator();

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
      padding: 60,
      maxZoom: 17,
      duration: 1000,   // ms
      essential: true,  // akkor is animál, ha a felhasználó csökkentett mozgást kért (prefers-reduced-motion)
    });    
    //console.log(resultBounds)
  }, [resultBounds]);

  useEffect(() => {
    if(!selectedId) { return; }
    popupRef.current = new mapboxgl.Popup({
      offset: 20,
      maxWidth: "360px",
      closeOnClick: false,
      className: "store-popup",
    }).setDOMContent(popupNodeRef.current);

    popupRef.current.on("close", () => setSelectedId(null));

    return () => popupRef.current?.remove();
  }, [selectedId]);

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

  }, [])



  return (
    <>
      {/* Desktop: inset map with numbered markers + floating detail card */}
      <div className="relative hidden h-full w-full overflow-clip rounded-lg lg:block">
        <div ref={mapContainerRef} className="absolute inset-0 h-full">
          {
            mapReady && map && (
              <>
                <StoreLayer map={map} stores={stores}></StoreLayer>
              </>          
            )
          }
        </div>
      </div>

      {/* Mobile: full-bleed map + horizontal store-card carousel overlaid on the fade at its bottom edge */}
      <div className="w-full lg:hidden">
        <div className="relative aspect-[375/668] w-full overflow-clip">
          <div className="absolute inset-0">
            <img alt="" className="absolute inset-0 size-full object-cover" src={imgMobileMapBackground1} />
            <img alt="" className="absolute inset-0 size-full object-cover" src={imgMobileMapBackground2} />
          </div>



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
