import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { sortByDistance } from "../utils/sortByDistance";
import { getBounds } from "../utils/getBounds";

const StoreLocatorContext = createContext(null);

const SPECIALIZATION_CHECKS = {
  "sportbike center": (p) => p.type === "sportbike center",
  cargo: (p) => p.cargo_on_display === true,
};

export const StoreLocatorProvider = ({ data, children }) => {

  const [storesJSON, setStoresJSON] = useState({"type": "FeatureCollection", "features": []});  
  const [selectedStore, setSelectedStore] = useState(null);  
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [location, setLocation] = useState(null);
  const [isFilterSet, setIsFilterSet] = useState(false);
  const [onlyXL, setOnlyXL] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const stores = useMemo(() => {
    return storesJSON;
  }, [storesJSON]);  

  const provinces = useMemo(() => {
    
    const storesByProvince = storesJSON.features.reduce((acc, store) => {
      const key = store.properties.provincie ?? "Unknown";
      (acc[key] ||= []).push(store);
      return acc;
    }, {}); 
    
    let provincesOrdered = Object.entries(storesByProvince).sort(([a], [b]) => a.localeCompare(b, "nl"));

    let provincesFinal = provincesOrdered.map((province) => {
      return {
        "name": province[0],
        "count": province[1].length,
        "stores": province[1]
      };
    });
    
    return provincesFinal;

  }, [storesJSON]);  

  const brands = useMemo(() => {
    return data.brands.map((brand) => {
      return {
        "id": brand.brand_id,
        "name": brand.brand_name
      }
    });
  }, [data]);

  const specializations = useMemo(() => {
    return [
      {"id": "sportbike center", "name": "Sport Bikes"},
      {"id": "cargo", "name": "Cargo Bikes"}
    ];
  }, []); 

  // Ez tartja a mindig az ős json-ból szűrt értékeket
  //megváltozik a betöltéskor, az xlSwitch változásakor és a location érték változásakor
  const filteredFeatures = useMemo(() => {

    let json = storesJSON;
    const brandIds = new Set(selectedBrands.map((b) => String(b.id)));
    const specIds = selectedSpecializations.map((s) => s.id);

    

    // Először nézzük meg hogy van e location
    if(location !== null) {
      // Ha van akkor állitsuk sorba a helyszintol valo tavolsag alapján
      json = sortByDistance(json, location?.coordinates);

      json = {
        ...json,
       features: json.features.slice(0, 5),
      }
    }

    json = {
      ...json,
      features: json.features.filter((f) => {
        const p = f.properties;

        // Filter stores by type (XL)
        if (onlyXL && !p.is_xl_store) return false;
        
        // Filters stores by brands
        const storeBrands = Array.isArray(f.properties.brands) ? f.properties.brands : [];
        if (brandIds.size > 0 && !storeBrands.some((id) => brandIds.has(String(id)))) {          
          return false;
        }

        // Filters stores by specialization
        if (specIds.length > 0) {
          const matches = specIds.some((id) => SPECIALIZATION_CHECKS[id]?.(p));
          if (!matches) return false;
        }

        return true;
      })
    } 
       

    return json
  },
  [storesJSON, onlyXL, location, selectedBrands, brands, selectedSpecializations]);

  const resultBounds = useMemo(() => {
    if(!filteredFeatures) { return; }
    if(!filteredFeatures?.features?.length === 0) { return; }

    const bounds = getBounds(filteredFeatures, {
      extraPoints: location?.coordinates ? [location.coordinates] : [],
    });
    return bounds;
  }, [filteredFeatures]); 

  useEffect(() => {

    let geojson = {"type": "FeatureCollection", "features": []};

    data.stores.forEach((store) => {
      
      const tags = [
        store.type === "sportbike center" && "sport",
        store.cargo_on_display && "cargo",
        store.has_ebikes && "ebike",
      ].filter(Boolean);

      let feature = {
        "type": "Feature",
        "properties": {...store, ...{"tags": tags}},
        "geometry": {
          "type": "Point",
          "coordinates": store.coordinates.reverse()
        }
      }
      geojson.features.push(feature);
    });

    setStoresJSON(geojson)    

  }, [data]);

  const value = useMemo(() => ({ 
    data,
    stores,
    provinces,
    brands,
    specializations,
    location,
    setLocation, 
    selectedId, 
    setSelectedId,
    isFilterSet,
    setIsFilterSet,
    onlyXL,
    setOnlyXL,
    selectedSpecializations,
    setSelectedSpecializations,
    selectedBrands,
    setSelectedBrands,
    filteredFeatures,
    initialLoad, 
    setInitialLoad,
    resultBounds,
    selectedStore,
    setSelectedStore,
    selectedStoreId, 
    setSelectedStoreId
  }), 
  [data, isFilterSet, selectedId, onlyXL, selectedBrands, selectedSpecializations, location, 
    stores, provinces, brands, specializations, filteredFeatures, initialLoad, resultBounds, selectedStore, selectedStoreId]);
 
  return (
    <StoreLocatorContext.Provider value={value}>
      {children}
    </StoreLocatorContext.Provider>
  );
}

export const useStoreLocator = () => {
  const ctx = useContext(StoreLocatorContext);
  if (!ctx) throw new Error("useStoreLocator must be used inside StoreLocatorProvider");
  return ctx;
}