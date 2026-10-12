import { useEffect } from "react";
import { useStoreLocator } from "../../context/StoreLocatorContext";

const StoreLayer = ({map, stores}) => {

  const { onlyXL, setSelectedId, selectedStoreId, setSelectedStoreId, filteredFeatures, setSelectedStore } = useStoreLocator();

  // Handlers
  const onStoreClickHandler = (e) => {
    const id = e.features[0].properties.id;
    setSelectedStore({"id": id, "source": "map"});
    setSelected(id);    
  }

  const setSelected = (id) => {

    map.setLayoutProperty("stores-lyr", "icon-image", [
      "case",
        ["==", ["get", "id"], id ?? ""],
        [
          "case",
            ["==", ["get", "is_xl_store"], true], "store-marker-xl-selected",
          "store-marker-normal-selected",
        ],
        ["==", ["get", "is_xl_store"], true], "store-marker-xl",
        "store-marker-normal",
    ]);

    map.setLayoutProperty("stores-lyr", "symbol-sort-key", [
      "case",
      ["==", ["get", "id"], id ?? ""], 1,
      0
    ]);

    map.setPaintProperty("stores-lyr", "text-color", [
      "case",
      ["==", ["get", "id"], id ?? ""], "#000000",
      "#FFFFFF"
    ]);    
    
    setSelectedId(id); 
    setSelectedStoreId(id);

  };  

  // Hooks
  useEffect(() => {

    if (!map) return;

    if(!stores) return;
    
    if (map.getLayer('stores-lyr'))   map.removeLayer('stores-lyr');
    if (map.getSource('stores-src')) map.removeSource('stores-src');

    map.addSource('stores-src', {
      type: 'geojson',
      data: stores,
    });

    map.addLayer({
        "id": "stores-lyr",
        "type": "symbol",
        "source": "stores-src",
        "layout": {
          "text-allow-overlap": true,
          "text-field": ["get", "store_num_id"],
          "text-size": 12,
          "text-offset": [
            "case", 
              ["==", ["get", "is_xl_store"], true], 
                [-1.4, 0.1], 
              [-0.6, 0.1]
          ], 
          "text-anchor": "center",
          "text-font": ["Inter Bold"],
          "icon-image": [
            "case", 
              ["==", ["get", "is_xl_store"], true], 
                "store-marker-xl",
              "store-marker-normal"
          ],
          "icon-size": 1,
          "icon-allow-overlap": true,
          "icon-ignore-placement": false,
          "icon-anchor": "center",          
        },
        "paint": {
          "text-color": "#FFFFFF"
        }        
    });
    
    // Attach events that belong to this layer
    map.on("click", "stores-lyr", onStoreClickHandler);
    map.on("mouseenter", "stores-lyr", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "stores-lyr", () => {
      map.getCanvas().style.cursor = "";
    }); 
    map.on("click", (e) => {
      const hit = map.queryRenderedFeatures(e.point, { layers: ["stores-lyr"] });
      if (!hit.length) {
        setSelected(null);
        setSelectedId(null);
      }
    });       


    return () => {

      // Detach all the events
      map.off("click", "stores-lyr", onStoreClickHandler);
      map.off("mouseenter", "stores-lyr", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.off("mouseleave", "stores-lyr", () => {
        map.getCanvas().style.cursor = "";
      });

      // Remove all the layers and their associated source
      if (map?.getLayer('stores-lyr'))   map?.removeLayer('stores-lyr');
      if (map?.getSource('stores-src')) map?.removeSource('stores-src');

    }
  }, [map, stores]);  

  useEffect(() => {
    if (!map || !map.getLayer('stores-lyr')) return;
    map.getSource('stores-src').setData(filteredFeatures);
  }, [map, onlyXL, filteredFeatures]);

  useEffect(() => {
    if(!setSelectedStoreId) { return; }
    setSelected(selectedStoreId)
  }, [selectedStoreId]);

  return null;
}

export default StoreLayer;