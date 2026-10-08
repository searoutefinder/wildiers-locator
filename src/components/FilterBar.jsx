import Switch from './Switch'; 
import { useStoreLocator } from "../context/StoreLocatorContext";
import LocationAutocomplete from "./LocationAutocomplete/LocationAutocomplete";
import GeolocateButton from "./GeolocateButton/GeolocateButton";
import MultiSelect from "./MultiSelect/MultiSelect";

// Internationalization
import { t } from "../i18n";

const FilterBar = ({
  selectedBrands,
  onBrandChange,
  brandOptions = [],
  specialty,
  onSpecialtyChange,
  specialtyOptions = [],
  onLocationChange,
  onXlToggleChange
}) => {

  const { onlyXL } = useStoreLocator();

  return (
    <div className="flex w-full flex-col items-start gap-4 lg:flex-row lg:items-start lg:gap-8">
      <div className="flex w-full min-w-0 flex-col gap-4 lg:flex-1 lg:gap-2.5">
        <div className="flex h-10 w-full items-end gap-3">
          <LocationAutocomplete 
            placeholder={t("locationInputPlaceholder")} 
            onLocationChange={onLocationChange}
          />
          <GeolocateButton />
        </div>

        {/* Mobile only: Selects live here, stacked full-width (desktop shows them in the right column) */}
        <div className="flex w-full flex-col gap-3 lg:hidden">
          <MultiSelect label={t("brandPlaceholder")} value={selectedBrands} onChange={onBrandChange} options={brandOptions} getValue={(opt) => opt.id}/>
          <MultiSelect label={t("specialtyPlaceholder")} value={specialty} onChange={onSpecialtyChange} options={specialtyOptions} getValue={(opt) => opt.id} />          
          <div className="flex w-full items-start gap-1.5">
            <img alt="" className="size-4 shrink-0" src="/icons/material-symbols/info.svg" />
            <p className="min-w-0 flex-1 text-xs text-[#161412]">{t("selectMessage")}</p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
          <div className="flex shrink-0 items-center gap-3">
            
            <label className="flex items-center gap-2 text-sm text-black cursor-pointer">
              <Switch 
                checked={onlyXL} 
                onChange={onXlToggleChange} 
              />
              {t("xlSwitchText")}
            </label>

            <span className="cursor-pointer flex h-6 items-center justify-center rounded-full bg-[#161412] px-2 py-0.5 text-sm font-semibold text-white">
              XL Store
            </span>
          
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <img alt="" className="size-4 shrink-0" src="/icons/material-symbols/info.svg" />
            <p className="min-w-0 text-xs text-[#161412]">{t("whatsAnXl")}</p>
          </div>
        </div>
      </div>

      {/* Desktop only: the two Selects side-by-side in their own column */}
      <div className="hidden w-[400px] shrink-0 flex-col gap-2.5 lg:flex">
        <div className="flex w-full items-center gap-3">
          <MultiSelect label={t("brandPlaceholder")} value={selectedBrands} onChange={onBrandChange} options={brandOptions} getValue={(opt) => opt.id}/>
          <MultiSelect label={t("specialtyPlaceholder")} value={specialty} onChange={onSpecialtyChange} options={specialtyOptions} getValue={(opt) => opt.id}/>
        </div>
        <div className="flex items-center gap-1">
          <img alt="" className="size-4 shrink-0" src="/icons/material-symbols/info.svg" />
          <p className="text-xs text-[#161412]">{t("selectMessage")}</p>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
