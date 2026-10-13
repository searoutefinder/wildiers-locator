import { t } from "../../i18n";

const NoResults = ({ className = "", onRemoveAll }) => (
  <div
    role="status"
    className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#d6d3d1] bg-[#fafaf9] p-6 text-center ${className}`}
  >
    <img alt="" className="size-8 opacity-60" src="/icons/material-symbols/store.svg" />
    <p className="text-base font-medium text-[#161412]">{t("noResults")}</p>
    <button 
      type="button" 
      onClick={onRemoveAll} 
      className="cursor-pointer flex shrink-0 items-center gap-2"
    >
      <span className="whitespace-nowrap text-sm text-[#161412] underline">{t("clearFiltersTxt")}</span>
    </button>    
  </div>
);

export default NoResults;