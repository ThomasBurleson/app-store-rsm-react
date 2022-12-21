import { useCallback } from "react";
import { createStore, useStore } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { syncStoreToUrl, syncUrlToStore } from "./app-store.bookmarks";
import {
  AppState,
  AppParams,
  Params,
  SliceSelector,
  UseAppStoreTuple,
  SELECTOR_IDENTITY
} from "./app-store.interfaces";

// ****************************************
// Private Zustand Instances
// ****************************************

const initParams = () => ({ i18n: "en" } as AppParams);

/**
 * Single global instance of the store
 * Immediately capture the URL params and update the store 1x
 *
 * NOTE: we use syncUrlToStore() to initialize store state with
 *       currently valid URL query params
 */
const store = syncUrlToStore(
  createStore<AppState>()(
    devtools(
      persist(
        immer((set) => ({
          // State
          params: initParams(),

          /**
           * Update 1...n params in AppState
           * @param params
           */
          add: (params: Params) => {
            set((state) => {
              state.params = { ...state.params, ...params };
            });
          },
          /**
           * Remove 1..n values in the AppState
           * @param keys
           */
          remove: (keys: string[]) => {
            set((state) => {
              keys.forEach((k) => {
                delete (state.params as any)[k];
              });
            });
          },
          /**
           * Clear all values (except defaults) in store
           */
          clearAll: () =>
            set((state) => {
              state.params = initParams();
            })
        })),
        {
          name: "appParams" // localStorage key
        }
      )
    )
  ),
  window?.location
);

// ****************************************
// Internal Bootstrap features
// ****************************************

/**
 * Define a bootstrap function that
 *  (a) listens for store changes and updates the URL
 *  (b) grabs current URL and merges into store state
 *      [that may have been restored from storage]
 */
const onBootStrap = () => {
  const onUpdateUrl = (state: AppState) => {
    const { history, location } = window;
    syncStoreToUrl(state.params, history, location);
  };

  /**
   * Establish permanent process to update the URL whenever the
   * app store changes.
   * NOTE: The url is updated only with App store query params
   */
  store.subscribe(onUpdateUrl);
  onUpdateUrl(store.getState());
};

onBootStrap(); // Important:  Run 1x to insure URL and Store are synchronized

// ****************************************
// Public Hook
// ****************************************

/**
 * Reusable hook 'useAppStore()' that
 *  - centralizes ALL app store data
 *  - publishes API to modify those params
 *  - publishes immutable snapshot of current state (AppParams)
 *  - supports optional 'selector' param to get a 'slice' of state
 *  - bidirectional synchronization between store state and URL query params
 */
export function useAppStore<StateSlice = AppParams>(
  selector?: SliceSelector<AppState, StateSlice>
): UseAppStoreTuple<StateSlice> {
  const slicer = (selector || SELECTOR_IDENTITY) as SliceSelector<
    AppState,
    StateSlice
  >;
  const { add, remove, clearAll } = store.getState();

  const memoizedSelector = useCallback(slicer, [selector]) as any;
  const slice: StateSlice = useStore(store, memoizedSelector);

  return [slice, { add, clearAll, remove }];
}
