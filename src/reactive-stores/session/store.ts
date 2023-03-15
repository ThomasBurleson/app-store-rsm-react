import { createStore, StoreApi } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist, devtools } from "zustand/middleware";

import { syncUrlToStore } from "./store.bookmarks";
import { Params, SessionViewModel, SessionState, UseSessionStoreTuple, SliceSelector, IDENTITY_SELECTOR } from "./store.model";

// ****************************************
// Private Zustand Instances
// ****************************************

type SetStateFn = (updateWithDraft: (draft: SessionViewModel) => void, replace?: boolean) => void;

const initParams = () => ({ i18n: "en" } as SessionState);
const initializeStore = (set: SetStateFn) => {
  const state = initParams();
  const api = {
    add: (updates: Params) => {
      // Update 1...n params in SessionState
      const { add, remove, clearAll, ...params } = updates;
      set((draft: SessionViewModel) => {
        return { ...draft, ...params };
      });
    },
    remove: (keys: string[]) => {
      // Remove 1..n values in the SessionState
      const replace = true;
      set((draft: SessionViewModel) => {
        const clone = { ...draft };
        keys.forEach((k) => {
          delete (clone as any)[k];
        });
        return clone;
      }, replace);
    },
    clearAll: () => {
      // Clear all values in the SessionState
      const replace = true;
      set(
        () => ({
          ...api,
          ...initParams(),
        }),
        replace
      );
    },
  };

  // Publish ViewModel
  return {
    ...state,
    ...api,
  };
};

/**
 * Single global instance of the store
 *  - The store will persist to and hydrate from sessionStorage
 *  - The store published state is immutable
 *  - The store is wrapped with devtools
 *
 * Immediately capture the URL params and update the store 1x
 *
 * NOTE: we use syncUrlToStore() to initialize store state with
 *       currently valid URL query params
 */
let store: StoreApi<SessionViewModel>;

export function makeSessionStore() {
  if (!store) {
    store = createStore<SessionViewModel>()(
      devtools(
        persist(immer(initializeStore), {
          name: "vsem.session", // should get session storage
          storage: createJSONStorage(() => sessionStorage),
          version: 1.1,
        })
      )
    );

    // Initialize store state with currently valid URL query params
    syncUrlToStore(store.getState());
  }
  return store;
}

// ****************************************
// Internal Bootstrap features
// ****************************************

export function extractStoreAPI() {
  const { add, remove, clearAll, ...ignore } = makeSessionStore().getState();
  return { add, remove, clearAll };
}
