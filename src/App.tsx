import { useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { AppState, AppParams, useAppStore } from "./stores/app-store";

import "./styles.css";

/**
 * This UI Component uses `useAppStore()` WITH a selector and gets a slice of
 * AppParams (the i18n) in the Tuple response.
 */

export const WelcomeWithSelector = () => {
  const selectLanguage = useCallback((state: AppState) => state.params.i18n, []);
  const [lang, api] = useAppStore<string>(selectLanguage);
  const updateLang = (lang: string) => api.add({ i18n: lang });

  return (
    <>
      <h1>With Selector: Current Language = {lang}</h1>
      <h2>Store = {JSON.stringify(lang, null, 2)}</h2>

      <p>
        <button onClick={() => updateLang("en")}>Use English</button>
        <button onClick={() => updateLang("es")}>Use Spanish</button>
        <button onClick={() => api.clearAll()}>Clear All Params</button>
      </p>
    </>
  );
};

/**
 * This UI Component uses `useAppStore()` WITHOUT a selector and gets
 * all the AppParams back in the Tuple response.
 *
 * The Set UUID button demonstrates that only <Welcome /> is updated
 *  - <Welcome /> watch all AppParams properties
 *  - <WelcomeWithSelector /> is only watching the AppParams::i18n property
 */
export const Welcome = () => {
  const [state, api] = useAppStore<AppParams>();
  const updateLang = (lang: string) => api.add({ i18n: lang });

  return (
    <>
      <h1>All Store Params</h1>
      <h2>{JSON.stringify(state, null, 2)}</h2>

      <p>
        <button onClick={() => updateLang("en")}>Use English</button>
        <button onClick={() => updateLang("es")}>Use Spanish</button>
        <button onClick={() => api.add({ uuid: "33333" })}>Set UUID</button>
        <button onClick={() => api.clearAll()}>Clear All Params</button>
      </p>
    </>
  );
};

export const Dashboard = () => {
  return (
    <>
      <Welcome />
      <div style={{ height: "40px" }}></div>
      <hr style={{ borderTop: "1px dashed blue", marginBottom: "14px" }}></hr>
      <WelcomeWithSelector />
    </>
  );
};

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
