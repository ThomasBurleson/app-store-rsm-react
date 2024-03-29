import { useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { SessionViewModel, useSessionStore } from "./reactive-stores";

import "./styles.css";

/**
 * This UI Component uses `useSessionStore()` WITH a selector and gets a slice of
 * AppParams (the i18n) in the Tuple response.
 */

export const WelcomeWithSelector = () => {
  const selectLanguage = useCallback((state: SessionViewModel) => state.i18n, []);
  const [lang, api] = useSessionStore<string>(selectLanguage);
  const updateLang = (lang: string) => api.add({ i18n: lang });

  return (
    <>
      <h1>With Selector: Current Language = {lang}</h1>
      <h2>Store = {JSON.stringify(lang, null, 2)}</h2>

      <p>
        <button disabled={lang == "en"} onClick={() => updateLang("en")}>
          Use English
        </button>
        <button disabled={lang == "es"} onClick={() => updateLang("es")}>
          Use Spanish
        </button>
        <button onClick={() => api.remove(["surveyDone"])}>Clear SurveyDone</button>
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
  const [vm] = useSessionStore<SessionViewModel>();
  const updateLang = (lang: string) => vm.add({ i18n: lang });

  return (
    <>
      <h1>All Store Params</h1>
      <h2>{JSON.stringify(vm, null, 2)}</h2>

      <p>
        <button onClick={() => updateLang("en")}>Use English</button>
        <button onClick={() => updateLang("es")}>Use Spanish</button>
        <button onClick={() => vm.add({ uuid: "33333" })}>Set UUID</button>
        <button onClick={() => vm.clearAll()}>Clear All Params</button>
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
