import StoreLocatorSection from './StoreLocatorSection';
import { StoreLocatorProvider } from './context/StoreLocatorContext';

const App = () => {
  return <StoreLocatorProvider data={rawData}>
    <StoreLocatorSection />
  </StoreLocatorProvider>;
}

const rawData = {

  "brands": [
    {
        "brand_id": "brand_1",  
        "brand_name": "Norta"
    },
    {
        "brand_id": "brand_2",  
        "brand_name": "Trek e-bikes"
    },
    {
        "brand_id": "brand_3",  
        "brand_name": "Trek Sport"
    },
    {
        "brand_id": "brand_4",  
        "brand_name": "Kalkhoff"
    },
    {
        "brand_id": "brand_5",  
        "brand_name": "Klever"
    },
    {
        "brand_id": "brand_6",  
        "brand_name": "Dutch ID"
    },
    {
        "brand_id": "brand_7",  
        "brand_name": "Lovens"
    },
    {
        "brand_id": "brand_8",  
        "brand_name": "Dolly"
    },
    {
        "brand_id": "brand_9",  
        "brand_name": "Urban Arrow"
    },
    {
        "brand_id": "brand_10",  
        "brand_name": "Van Raam"
    },
    {
        "brand_id": "brand_11",  
        "brand_name": "Tern"
    },
    {
        "brand_id": "brand_12",  
        "brand_name": "Brompton"
    },
    {
        "brand_id": "brand_13",  
        "brand_name": "UTO"
    },
    {
        "brand_id": "brand_14",  
        "brand_name": "Victoria"
    },
    {
        "brand_id": "brand_15",  
        "brand_name": "Bataavus"
    },
    {
        "brand_id": "brand_16",  
        "brand_name": "Koga"
    },
    {
        "brand_id": "brand_17",  
        "brand_name": "Sparta"
    },
    {
        "brand_id": "brand_18",  
        "brand_name": "Moustache"
    },
    {
        "brand_id": "brand_19",  
        "brand_name": "i:SY"
    },
    {
        "brand_id": "brand_20",  
        "brand_name": "Qio"
    },
    {
        "brand_id": "brand_21",  
        "brand_name": "Bianchi e-bike"
    },
    {
        "brand_id": "brand_22",  
        "brand_name": "Bianchi Sport"
    },
    {
        "brand_id": "brand_23",  
        "brand_name": "Cervelo"
    },
    {
        "brand_id": "brand_24",  
        "brand_name": "Lapierre"
    },
    {
        "brand_id": "brand_25",  
        "brand_name": "BH"
    },  
    {
        "brand_id": "brand_26",  
        "brand_name": "äska"
    },
    {
        "brand_id": "brand_27",  
        "brand_name": "Riese & Müller"
    }    
  ],
  "stores": [
    {
      "id": "1",
      "name": "Kapellen",
      "type": "sportbike center",
      "address": "Antwerpsesteenweg 213/217",
      "city": "Kapellen",
      "postal": "2950",
      "provincie": "Antwerpen",
      "email": "kapellen@fietsenwildiers.be",
      "coordinates": [51.306642702198, 4.4338363485914245],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/09/wildiers-kapellen-winkel-3.jpg"
      ],      
      "brands": ["brand_10", "brand_2", "brand_5", "brand_7"]

    },
    {
      "id": "2",
      "name": "Zwijndrecht",
      "type": "sportbike center",
      "address": "Verbrandendijk 106",
      "city": "Zwijndrecht",
      "postal": "2070",
      "provincie": "Antwerpen",
      "email": "zwijndrecht@fietsenwildiers.be",
      "coordinates": [51.21975357227721, 4.3389689146878965],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2024/05/Zwijndrecht020524-5387-scaled.jpg"
      ],    
      "brands": ["brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "3",
      "name": "Geel",
      "type": "sportbike center",
      "address": "Nieuwstraat 88",
      "city": "Geel",
      "postal": "2440",
      "provincie": "Antwerpen",
      "email": "geel@fietsenwildiers.be",
      "coordinates": [51.21975357227721, 4.3389689146878965],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/09/wildiers-geel-winkel-3.jpg"
      ],      
      "brands": ["brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "4",
      "name": "Hasselt",
      "type": "sportbike center",
      "address": "Heidestraat 6",
      "city": "Hasselt",
      "postal": "3500",
      "provincie": "Limburg",
      "email": "hasselt@fietsenwildiers.be",
      "coordinates": [50.94216528327537, 5.3610281404547075],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      }, 
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/08/wildiers-hasselt-winkel-3.jpg"
      ],     
      "brands": ["brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "5",
      "name": "Malle",
      "type": "bike center",
      "address": "Hoogstraatsebaan 25",
      "city": "Malle",
      "postal": "2390",
      "provincie": "Antwerpen",
      "email": "malle@fietsenwildiers.be",
      "coordinates": [51.30345953103563, 4.735120898312351],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      }, 
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/09/wildiers-lochristi-winkel-3.jpg"
      ],     
      "brands": ["brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "6",
      "name": "Keerbergen",
      "type": "bike center",
      "address": "Lindenstraat 14",
      "city": "Keerbergen",
      "postal": "3140",
      "provincie": "Vlaams-brabant",
      "email": "",
      "coordinates": [51.00237767401562, 4.6344372749791],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/08/wildiers-winkel-keerbergen-1.jpg"
      ],    
      "brands": ["brand_13", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "7",
      "name": "Bekkevoort",
      "type": "sportbike center",
      "address": "Staatsbaan 161/B",
      "city": "Bekkevoort",
      "postal": "3460",
      "provincie": "Vlaams-brabant",
      "email": "bekkevoort@fietsenwildiers.be",
      "coordinates": [50.946044605001205, 4.97885822384596],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },   
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/08/wildiers-bekkevoort-winkel-6.jpg"
      ],   
      "brands": ["brand_11", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "8",
      "name": "Gent",
      "type": "bike center",
      "address": "Brugsesteenweg 652",
      "city": "Gent",
      "postal": "9030",
      "provincie": "Oost-Vlaanderen",
      "email": "gent@fietsenwildiers.be",
      "coordinates": [51.076070984426266, 3.6789197647865595],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/08/wildiers-gent-winkel-5.jpg"
      ],      
      "brands": ["brand_18", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "9",
      "name": "Drongen",
      "type": "sportbike center",
      "address": "Baarledorpstraat 31",
      "city": "Drongen",
      "postal": "9031",
      "provincie": "Oost-Vlaanderen",
      "email": "drongen@fietsenwildiers.be",
      "coordinates": [51.03681973022618, 3.617659466129177],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/08/wildiers-drongen-winkel-1.jpg"
      ],    
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "10",
      "name": "Lommel",
      "type": "bike center",
      "address": "Buitensingel 74",
      "city": "Lommel",
      "postal": "3920",
      "provincie": "Limburg",
      "email": "lommel@fietsenwildiers.be",
      "coordinates": [51.22164864454839, 5.320475324333961],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },   
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/09/wildiers-lommel-winkel-2.jpg"
      ],   
      "brands": ["brand_13", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "11",
      "name": "Poederlee",
      "type": "bike center",
      "address": "Dorp 35",
      "city": "Poederlee",
      "postal": "2275",
      "provincie": "Antwerpen",
      "email": "poederlee@fietsenwildiers.be",
      "coordinates": [51.228788232070464, 4.835088153225342],
      "cargo_on_display": false,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },    
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/09/wildiers-poederlee-winkel-2.jpg"
      ],  
      "brands": ["brand_13", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "12",
      "name": "Lochristi",
      "type": "bike center",
      "address": "",
      "city": "Lochristi",
      "postal": "9080",
      "provincie": "Oost-Vlaanderen",
      "email": "lochristi@fietsenwildiers.be",
      "coordinates": [51.09794506691844, 3.838206116047223],
      "cargo_on_display": false,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      }, 
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/09/wildiers-lochristi-winkel-3.jpg"
      ],     
      "brands": ["brand_15", "brand_16", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "14",
      "name": "Oud-Turnhout",
      "type": "bike center",
      "address": "Tramwissel 1",
      "city": "Oud-Turnhout",
      "postal": "2360",
      "provincie": "Antwerpen",
      "email": "oud-turnhout@fietsenwildiers.be",
      "coordinates": [51.32034059004851, 4.975275857629108],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/09/wildiers-lochristi-winkel-3.jpg"
      ],    
      "brands": ["brand_16", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "15",
      "name": "Zandhoven",
      "type": "sportbike center",
      "address": "Ringlaan 22",
      "city": "Zandhoven",
      "postal": "2240",
      "provincie": "Antwerpen",
      "email": "zandhoven@fietsenwildiers.be",
      "coordinates": [51.208483507610744, 4.656424585357915],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      }, 
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/08/wildiers-zandhoven-winkel-2.jpg"
      ],     
      "brands": ["brand_15", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "16",
      "name": "Merksplas",
      "type": "bike center",
      "address": "Leopoldstraat 8",
      "city": "Merksplas",
      "postal": "2330",
      "provincie": "Antwerpen",
      "email": "merksplas@fietsenwildiers.be",
      "coordinates": [51.35749496127893, 4.863737033632551],
      "cargo_on_display": false,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/09/wildiers-merksplas-winkel-1.jpg"
      ],    
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "17",
      "name": "Tessenderlo",
      "type": "bike center",
      "address": "Diesterstraat 162",
      "city": "Tessenderlo",
      "postal": "3980",
      "provincie": "Limburg",
      "email": "tessenderlo@fietsenwildiers.be",
      "coordinates": [51.058574661614585, 5.08848075927131],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      }, 
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/09/Tessenderlo_FietsenWildiers_160525-9480-scaled.jpg"
      ],     
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "18",
      "name": "As",
      "type": "sportbike center",
      "address": "Breeërweg 15/A",
      "city": "As",
      "postal": "3665",
      "provincie": "Limburg",
      "email": "as@fietsenwildiers.be",
      "coordinates": [51.015219625852765, 5.5803001000000005],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      }, 
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2025/02/Wildiers-Winkel-As-2-min.webp"
      ],     
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "19",
      "name": "Olen",
      "type": "bike center",
      "address": "Lichtaartseweg 3",
      "city": "Olen",
      "postal": "2440",
      "provincie": "Antwerpen",
      "email": "olen@fietsenwildiers.be",
      "coordinates": [51.189040820927175, 4.903047023837027],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      }, 
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/09/wildiers-lochristi-winkel-3.jpg"
      ],     
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "20",
      "name": "Heusden-Zolder",
      "type": "bike center",
      "address": "Bieststraat 168",
      "city": "Heusden-Zolder",
      "postal": "3550",
      "provincie": "Limburg",
      "email": "heusden-zolder@fietsenwildiers.be",
      "coordinates": [51.01778944357814, 5.296911597836188],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },   
      "images": [
        'https://www.fietsenwildiers.be/wp-content/uploads/2024/08/wildiers-winkel-drongen-1.jpg'
      ],   
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "21",
      "name": "Leuven ",
      "type": "sportbike center",
      "address": "Brusselsesteenweg 28",
      "city": "Leuven ",
      "postal": "3020",
      "provincie": "Vlaams-brabant",
      "email": "leuven@fietsenwildiers.be",
      "coordinates": [50.887010938725794, 4.667388280127527],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        'https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_19_c87980_c1e0691c339047068d1e72e14956ffb7mv2.jpg'
      ],    
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "22",
      "name": "Ukkel",
      "type": "sportbike center",
      "address": "Chau. de Waterloo 1255",
      "city": "Ukkel",
      "postal": "1180",
      "provincie": "Brussel",
      "email": "uccle@fietsenwildiers.be",
      "coordinates": [50.79361428700302, 4.373664363620752],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        'https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_17_c87980_f25f21a961ef44ad98081dfb05dbc228mv2.jpg'
      ],    
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "23",
      "name": "Aalst",
      "type": "sportbike center",
      "address": "Grote Steenweg 95",
      "city": "Aalst",
      "postal": "9340",
      "provincie": "Oost-Vlaanderen",
      "email": "aalst@fietsenwildiers.be",
      "coordinates": [50.95889986886815, 3.8965145646391117],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        'https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_19_c87980_120f3e204f0c4bafbf348f9a95c1cffbmv2.jpg'
      ],    
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "24",
      "name": "Melle",
      "type": "sportbike center",
      "address": "Brusselsesteenweg 264",
      "city": "Melle",
      "postal": "9090",
      "provincie": "Oost-Vlaanderen",
      "email": "melle@fietsenwildiers.be",
      "coordinates": [51.00148114120785, 3.803940539681922],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      }, 
      "images": [
        'https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_20_c87980_aab59723a8f64d3896a118ebf1abf0bdmv2.jpg'
      ],     
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "25",
      "name": "Maldegem",
      "type": "bike center",
      "address": "Staatsbaan 2",
      "city": "Maldegem",
      "postal": "9991",
      "provincie": "Oost-Vlaanderen",
      "email": "maldegem@fietsenwildiers.be",
      "coordinates": [51.20427177260785, 3.4719801150916942],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },   
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_23_c87980_80716ab75dc04bbf895193a111b1d0c9mv2.jpg"
      ],   
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "26",
      "name": "Blankenberge",
      "type": "bike center",
      "address": "De Smet de Naeyerlaan 98",
      "city": "Blankenberge",
      "postal": "8370",
      "provincie": "West-Vlaanderen",
      "email": "blankenberge@fietsenwildiers.be",
      "coordinates": [51.31190205591535, 3.1299332884931483],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },   
      "images": [
        'https://www.fietsenwildiers.be/wp-content/uploads/2026/01/R-Blankenberge-imgi_20_c87980_9988b3bbe0cd43d0b954bc52a920946emv2.jpg'
      ],   
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "27",
      "name": "Oostende",
      "type": "sportbike center",
      "address": "Vindictivelaan 13",
      "city": "Oostende",
      "postal": "8400",
      "provincie": "West-Vlaanderen",
      "email": "oostende@fietsenwildiers.be",
      "coordinates": [51.227945443713594, 2.9202899963404514],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },    
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_25_c87980_52885424ff9440159ff03f56fa52feb6mv2.jpg"
      ],  
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "28",
      "name": "Torhout",
      "type": "sportbike center",
      "address": "Hofstraat 1",
      "city": "Torhout",
      "postal": "8820",
      "provincie": "West-Vlaanderen",
      "email": "torhout@fietsenwildiers.be",
      "coordinates": [51.064533335262915, 3.1024100115802673],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_23_c87980_80716ab75dc04bbf895193a111b1d0c9mv2.jpg"
      ],    
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "29",
      "name": "Waregem",
      "type": "bike center",
      "address": "Gentseweg 587",
      "city": "Waregem",
      "postal": "8790",
      "provincie": "West-Vlaanderen",
      "email": "waregem@fietsenwildiers.be",
      "coordinates": [50.89970519070056, 3.4012193364320145],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_23_6c6e4b_f38d1521baff4125a75d0d99cce79e86mv2.jpg"
      ],    
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "30",
      "name": "Kortrijk",
      "type": "bike center",
      "address": "Doorniksestraat 34",
      "city": "Kortrijk",
      "postal": "8500",
      "provincie": "West-Vlaanderen",
      "email": "kortrijk@fietsenwildiers.be",
      "coordinates": [50.825741010394395, 3.267146165747046],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_22_c87980_35719506240241d9a4a6211064ba656cmv2.jpg"
      ],    
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "31",
      "name": "Ieper",
      "type": "bike center",
      "address": "Menenstraat 36",
      "city": "Ieper",
      "postal": "8900",
      "provincie": "West-Vlaanderen",
      "email": "ieper@fietsenwildiers.be",
      "coordinates": [50.85177328451135, 2.890105315653955],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_18_c87980_7bf303848ec74c029ef61c88ffadea7bmv2.jpg"
      ],      
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "32",
      "name": "Roeselare",
      "type": "bike center",
      "address": "Hoogleedsesteenweg 155",
      "city": "Roeselare",
      "postal": "8800",
      "provincie": "West-Vlaanderen",
      "email": "roeselare@fietsenwildiers.be",
      "coordinates": [50.95391866217812, 3.115196482084439],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": false,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },   
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2026/01/imgi_23_c87980_dae25365b0d94928a83141c16c2691acmv2.jpg"
      ],   
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "33",
      "name": "Hasselt QB",
      "type": "bike center",
      "address": "Gelatineboulevard 5",
      "city": "Hasselt QB",
      "postal": "3500",
      "provincie": "Limburg",
      "email": "hasselt_QB@fietsenwildiers.be",
      "coordinates": [50.93565767344175, 5.336218314351822],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      }, 
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/08/wildiers-hasselt-winkel-1.jpg"
      ],     
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "34",
      "name": "Herk de Stad",
      "type": "sportbike center",
      "address": "Pastorijstraat 7",
      "city": "Herk de Stad",
      "postal": "3540",
      "provincie": "Limburg",
      "email": "herk@fietsenwildiers.be",
      "coordinates": [50.94494245100719, 5.133370423915758],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/08/wildiers-hasselt-winkel-1.jpg"
      ],    
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    },
    {
      "id": "35",
      "name": "Genk",
      "type": "sportbike center",
      "address": "Nieuwstraat 39",
      "city": "Genk",
      "postal": "3600",
      "provincie": "Limburg",
      "email": "genk@fietsenwildiers.be",
      "coordinates": [50.96202835315884, 5.497985016711447],
      "cargo_on_display": true,
      "has_ebikes": true,
      "is_xl_store": true,
      "opening_times": {
        "mon": "",
        "tue": "",
        "wed": "",
        "thu": "",
        "fri": "",
        "sat": "",
        "sun": ""
      },  
      "images": [
        "https://www.fietsenwildiers.be/wp-content/uploads/2023/08/wildiers-hasselt-winkel-1.jpg"
      ],    
      "brands": ["brand_1", "brand_10", "brand_2", "brand_5", "brand_7"]
    }                                                                                               
  ]
};

export default App;
