// Core
import { useEffect, useRef, useState, useMemo } from "react";

// Deps
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Custom
import { t } from "../i18n";
import StoreLayer from './Layers/StoreLayer';
import StorePopup from "./StorePopup/StorePopup";

// Context
import { useStoreLocator } from "../context/StoreLocatorContext";

export default function MapPanel ({ isDesktop = true, bottomInset = 0, showPopup = true }) {

  mapboxgl.accessToken    = import.meta.env.VITE_MAPBOX_TOKEN;

  // Refs
  const mapContainerRef   = useRef(null);
  const mapRef            = useRef(null);
  const map               = mapRef.current;

  // Context
  const { stores, selectedStore, resultBounds, initialLoad, setInitialLoad } = useStoreLocator();

  // State
  const [mapReady, setMapReady] = useState(false);   

  // Hooks
  useEffect(() => {
    if(!map) { return; }
    if(!resultBounds) { return; }

    map.fitBounds(resultBounds, {
      padding: { 
        top: 60, 
        right: 60, 
        left: 60, 
        bottom: 60 + bottomInset 
      },
      maxZoom: 17,
      duration: 1000,
      essential: true,
    });    
    
  }, [resultBounds]);

  useEffect(() => {
    
    if (mapRef.current) return
    if (!mapContainerRef.current) return

    let mapOptions = {
      container: mapContainerRef.current,
      style: import.meta.env.VITE_MAPBOX_STYLE_URL,
      bounds: [[2.51, 49.50],[6.41, 51.51]],
      zoom: 9,
      locale: {
        'ScrollZoomBlocker.CtrlMessage': t("mapCtrlScroll"),
        'ScrollZoomBlocker.CmdMessage': t("mapCmdScroll"),
        'TouchPanBlocker.Message': t("mapTwoFingers"),
      }      
    }

    if(!isDesktop) {
      mapOptions["cooperativeGestures"] = true;
    }

    const map = new mapboxgl.Map(mapOptions);

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
