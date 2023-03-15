import { useEffect, useMemo, useState } from "react";
import { StoreApi, useStore } from "zustand";

import { syncStoreToUrl } from "./store.bookmarks";
import { SessionViewModel, UseSessionStoreTuple, SliceSelector, IDENTITY_SELECTOR } from "./store.model";
import { extractStoreAPI, makeSessionStore } from "./store";

/**
 * Reusable hook 'useAppStore()' that
 *  - centralizes ALL app store data
 *  - publishes API to modify those params
 *  - publishes immutable snapshot of current state (SessionViewModel)
 *  - supports optional 'selector' param to get a 'slice' of state
 *  - bidirectional synchronization between store state and URL query params
 */
export function useSessionStore<StateSlice>(
  selector?: SliceSelector<StoreApi<SessionViewModel>, StateSlice>
): UseSessionStoreTuple<StateSlice> {
  // Build external store and connect with `useStore()`

  const [store] = useState(makeSessionStore());
  const api = useMemo(extractStoreAPI, [store]);
  const vm = useStore(store, selector || IDENTITY_SELECTOR<StateSlice>());

  useEffect(() => {
    // Update URL as store state changes
    // With store hydrated, make sure to sync BACK to url immediately

    const unsubscribe = store.subscribe(syncStoreToUrl);
    syncStoreToUrl(store.getState());

    return () => unsubscribe();
  }, []);

  // publish API separately from the immutable snapshot of state
  return [vm, api];
}
