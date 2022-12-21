import { StoreApi } from "zustand";
import { AppParams, AppState } from "./app-store.interfaces";

/**
 * Utility methods for bidi synchronization of URL query params
 * to Store state.
 *
 *
 * NOTE: Only used internally by AppStore
 */

// ************************************************
// Query Param Utils
// ************************************************

const ALLOWED_KEYS = ["i18n", "lang", "uuid", "phase", "proxy"];

function toKeyVals(searchParams: any, allowedKeys?: string[]) {
  let params: Record<string, any> = {};
  searchParams.forEach((val: string, key: string) => {
    const isAllowed = !allowedKeys || allowedKeys.includes(key);

    if (isAllowed && !!val) params[key] = val;
  });

  // Consolidate lang keys
  if (params.lang) params.i18n = params.lang;
  delete params.lang;

  return params;
}

/**
 * Which params in the URL should be used to update the AppStore?
 */
export function extractQueryParams(
  location: Location & { state?: any }
): Record<string, any> {
  const { search, state } = location;
  const searchParams = new URLSearchParams(search || "");
  const queryParams = toKeyVals(searchParams, ALLOWED_KEYS);

  const { phase, lang } = queryParams;
  // Coerce non-string values to appropriate types.
  if (phase) queryParams.phase = parseInt(phase, 10);
  if (lang) queryParams.i18n = lang;
  if (state?.proxy) queryParams.proxy = state.proxy;

  return queryParams;
}

/**
 * Which keys in the store should be shown on the URL?
 */
export function buildQueryParams(
  storeParams: Record<string, any>,
  urlParams: Record<string, any>
): Record<string, any> {
  // Scan all allowed fields for valid values
  // NOTE: if undefined store value, then remove from URL
  ALLOWED_KEYS.forEach((k: string) => {
    const value = storeParams[k];
    if (value) urlParams.set(k, value);
    else urlParams.delete(k);
  });

  return urlParams;
}

// **********************************************************
// Bookmark utils for bidi synchronization of URL to Store
// **********************************************************

/**
 * Gather current values in the store and reflect those
 * to show on the URL for bookmarking
 */
export function syncStoreToUrl(
  storeParams: AppParams,
  history: History,
  location: Location
) {
  if (history && location) {
    const { search, origin, pathname } = location;

    const searchParams = new URLSearchParams(search);
    const urlParams = buildQueryParams(storeParams, searchParams);
    const newUrl = `${origin}${pathname}?${urlParams.toString()}`;

    debugger;
    // update the bookmark
    history.replaceState({ path: newUrl }, "", newUrl);
  }
}

/**
 * Using the History location object, gather expected query params
 * and update the Store state
 *
 * NOTE: do as the 'store' is being initialized/created
 */
export function syncUrlToStore(
  store: any,
  location: Location
): StoreApi<AppState> {
  if (location) {
    store.setState((state: AppState) => {
      const params = extractQueryParams(location);

      const { uuid, phase } = params;
      if (uuid && phase && state.params.phase !== phase)
        params.surveyDone = false;

      state.params = { ...state.params, ...params };
    });
  }
  return store;
}
