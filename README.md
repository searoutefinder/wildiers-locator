# Wildiers store locator

React + Vite + Tailwind CSS 4 alkalmazás, a Figma dev mode node-ból generálva
(`Winkels Section Mapbox` — https://www.figma.com/design/X81XHvMooJp9ML06ljL2dL/Wildiers-WF-2026?node-id=10417-132547).

## Indítás

```bash
npm install
npm run dev
```

Ezután nyisd meg a terminálban kiírt címet (alapból http://localhost:5173).

Build-eléshez:

```bash
npm run build
npm run preview
```

## Szerkezet

- `src/App.jsx` — csak a `StoreLocatorSection`-t rendereli
- `src/StoreLocatorSection.jsx` — a teljes szekció, alján demó adatokkal
- `src/components/` — `FilterBar`, `ResultsBar`, `StoreCard`, `MapPanel`, `ProvinceAccordion`
- `src/assets.js` — a Figma-ból exportált ikon/kép URL-ek

## Amit még érdemes elvégezni éles használat előtt

1. **Assetek letöltése**: az `assets.js`-ben lévő `https://www.figma.com/api/mcp/asset/...` linkek kb. 7 napig élnek.
   Töltsd le őket (pl. `public/icons/` és `public/images/` alá), és cseréld le rájuk az importokat.
2. **Valós térkép**: a `MapPanel` jelenleg a Figma-mockup statikus térkép-screenshotját mutatja. Kösd be a
   Mapbox GL JS térképedet, és a marker/popup JSX-et (vagy Code Connect-tel a saját Marker/Popup komponenseidet)
   tedd rá a valós térképre.
3. **Valós adatok**: a `StoreLocatorSection.jsx` alján lévő `demoNearbyStores` / `demoMarkers` / `demoProvinces`
   helyére kösd be a saját üzlet-API-dat. A tartományneveket (Antwerpen, Vlaams-Brabant, Limburg,
   Oost-Vlaanderen, West-Vlaanderen, Brussel) a Figma-képernyőképről olvastam le.

## Változások (pontossági javítás a Figma mester-komponens alapján)

Az első verziót egy Figma *instance*-ból (page-en elhelyezett példányból) építettem, ahol néhány mélyebben
beágyazott node üres wrappert adott vissza a Figma MCP-től, ezért ott képernyőkép + becslés alapján kellett
kézzel pótolnom a részleteket. A `node-id=10346-16233` a section *mester-komponense* — ez minden node-on
hiánytalanul feloldódott, így pontos forrásból tudtam újraellenőrizni és javítani:

- **Accordion kártyák**: `grid grid-cols-5 gap-4` + fix `w-[300px]` kártyaszélesség helyett most `flex` sor
  `gap-3` (12px, a tényleges Figma-érték) közökkel, és a kártyák `flex-1`-ként töltik ki a helyet — ezért nem
  lógnak ki többé a panelból, és van közöttük térköz.
- **Store card**: pontos nyitvatartás-logika (`status: 'open'|'closed'` + `statusDetail`), a kiemelt/kiválasztott
  kártya (zöld keret + halványzöld háttér, a térkép popupban és az oldalsávban egyaránt) most `highlighted` prop-pal.
- **Térkép markerek**: a képernyőkép-alapú, becsült pozíciók helyett a Figma pixel-koordinátáiból számolt
  pontos százalékos pozíciók, és a marker-színek/XL-jelzés is az eredeti node-okból (nem mindegyik winkel
  markere egyezik a hozzá tartozó kártya XL-állapotával — ez így van az eredeti Figma-mockupban is).
- **Filter bar / results bar / heading**: pixelre pontos gap- és paddingértékek (pl. a cím `48px`, nem `40px`;
  a szűrősor belső közei `10px`/`12px`, nem a korábbi becsült értékek).

## Reszponzivitás (a Figma "Breakpoint=Mobile" — 375px — frame alapján)

A szekció most `lg:` (1024px) töréspont körül vált a mobil és a desktop elrendezés között — mobile-first
osztályokkal (alap = mobil), és `lg:`-vel felülírva a korábban leszállított 1280px-es desktop dizájnra.
Ahol a mobil és a desktop DOM-szerkezete gyökeresen eltér (lásd lent), ott két külön blokk van megjelenítve,
`hidden lg:flex` / `lg:hidden` párral kapcsolva — nem próbáltam ugyanazt a DOM-ot CSS-sel „széthúzni” két
nagyon különböző elrendezésre.

- **FilterBar**: mobilon minden egy oszlopba kerül — keresőmező + ikon-only (40×40) „mijn locatie” gomb egy
  sorban, alatta a két Select teljes szélességben, majd a szűrő-infó sor, majd a XL-toggle + saját infó sora
  (mind `flex-col`). Desktopon (`lg:`) visszaáll az eredeti két oszlopos elrendezés (bal oldali kereső+toggle,
  jobb oldali 400px-es Select-oszlop).
- **ResultsBar**: mobilon a felső sor csak a találatszám + „Filters wissen” (`justify-between`, elválasztó
  vonalak nélkül), a szűrő-chipek külön, egymás alatti sorokba kerülnek. Desktopon (`lg:`) az eredeti egy
  soros, elválasztóvonalas elrendezés.
- **MapPanel**: két teljesen külön almodul. Desktopon (`lg:`) változatlan a beágyazott térkép + lebegő
  találati kártya. Mobilon a térkép **szél-szélig (full-bleed)** jelenik meg (a szekció oldalpaddingjából
  `-mx-5`-tel kilógatva), és a bal oldali lista helyett egy **vízszintesen görgethető kártya-csík** (180px-es
  "Store Card"-ok) úszik a térkép aljára, fentről lefelé fehérbe fakuló háttérrel. A mobil mockupban más
  térkép-kivágás/zoom van, ezért a markerei külön `mobileMarkers` propon (saját 375×668-as koordináta-rendszer)
  mennek be — nem ugyanaz, mint a desktop `markers` tömbje.
- **ProvinceAccordion**: a kinyitott panel kártyarácsa mobilon 2 oszlopos CSS grid (`grid grid-cols-2 gap-3`,
  a Figma "Grid" node alapján), desktopon (`lg:`) marad az eredeti `flex` sor (`flex-1` kártyákkal).
- **StoreCard**: a `size` prop most három érték egyike:
  - `"default"` — széles kártya az oldalsávban / térkép-popupban, CTA-gombokkal (Route plannen / Plan je testrit);
  - `"carousel"` — új, 180px széles, gombok nélküli változat a mobil térkép-csíkhoz (nagyobb, „lebegő” árnyékkal
    kiemelt állapotban);
  - `"small"` — kompakt, gombok és távolság nélküli változat a provincia-rácshoz (60px-es szalag a 80px helyett).

  Eközben egy pontossági javítást is végrehajtottam a kártya belső elrendezésén: a friss (mobil) Figma-fetchek
  egyértelműen azt mutatták, hogy a névsor, az "XL Store" jelvény és a nyitvatartás **egymás alatt**, külön
  sorokban vannak (nem a név+jelvény egy sorban, majd távolság+nyitvatartás egy másik sorban, ahogy korábban
  implementáltam) — ezt minden mérethez javítottam, a névbetűméretet is (`14px`, nem `16px`).

Amit nem próbáltam pixelpontosan visszaadni: a mobil térkép alatti kártya-csík Figma-beli „fehérbe úszás”
pontos magassága (a térkép képe alatt van egy kb. 132px-es üres/fehér sáv, amire a csík részben rálóg) — ehelyett
egy egyszerűbb, arányosan skálázódó `-mt-[140px]` + színátmenetes trükköt használtam, ami vizuálisan hasonló
hatást ad, de nem px-pontos másolat.
