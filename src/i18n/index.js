import nl from "./locales/nl.json";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

const dictionaries = { nl, fr, en };
const FALLBACK = "nl";

function detectLocale() {
  const firstSegment = location.pathname.split("/")[1] ?? "";
  const short = firstSegment.split("-")[0].toLowerCase();
  return dictionaries[short] ? short : FALLBACK;
}

export const locale = detectLocale();
const dict = dictionaries[locale];

export function t(key, vars = {}) {
  const text = dict[key] ?? dictionaries[FALLBACK][key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`);
}