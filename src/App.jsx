import { useEffect, useState } from "react";
import StoreLocatorSection from "./StoreLocatorSection";
import { StoreLocatorProvider } from "./context/StoreLocatorContext";
import { fetchLocatorData } from "./api/fetchLocatorData";

// Internationalization
import { t } from './i18n'

const App = () => {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();

    fetchLocatorData(ctrl.signal)
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e);
      });

    return () => ctrl.abort();
  }, []);

  if (error) {
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-10 lg:px-20 lg:py-16">
        <p className="text-lg text-[#161412]">{t("storesCouldntLoadTxt")}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-10 lg:px-20 lg:py-16">
        <p className="text-lg text-[#161412]">{t("loadingStoresTxt")}</p>
      </section>
    );
  }

  return (
    <StoreLocatorProvider data={data}>
      <StoreLocatorSection />
    </StoreLocatorProvider>
  );
};

export default App;