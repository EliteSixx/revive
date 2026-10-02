import { useSyncExternalStore } from "react";

// In-browser store for sample data that changes while someone uses the prototype
// (for example a withdrawn consent or a confirmed employment). Frontend phase only:
// Phase 2 replaces these stores with the database. See architecture.md section 10.
//
// State is kept in sessionStorage so it survives page changes in the same tab and
// resets when the tab is closed. Storage can be unavailable (private mode, blocked
// site data), so every access is wrapped and the store falls back to memory.

const STORAGE_PREFIX = "revive-sample:";

export interface MockStore<State> {
  readonly initialState: State;
  getState: () => State;
  setState: (update: (current: State) => State) => void;
  subscribe: (listener: () => void) => () => void;
  reset: () => void;
}

const createdStores = new Set<MockStore<unknown>>();

/** Creates a store. Call once per data set, at module level, with a unique name. */
export function createMockStore<State>(
  name: string,
  initialState: State,
): MockStore<State> {
  const storageKey = `${STORAGE_PREFIX}${name}`;
  const listeners = new Set<() => void>();
  let state = initialState;
  let hasReadStorage = false;

  function readStorageOnce() {
    if (hasReadStorage || typeof window === "undefined") return;
    hasReadStorage = true;
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      if (saved !== null) state = JSON.parse(saved) as State;
    } catch {
      // Storage unavailable or corrupt: keep the initial sample data.
    }
  }

  function writeStorage() {
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Storage unavailable: the change still lives in memory for this page.
    }
  }

  function notify() {
    for (const listener of listeners) listener();
  }

  const store: MockStore<State> = {
    initialState,
    getState() {
      readStorageOnce();
      return state;
    },
    setState(update) {
      readStorageOnce();
      state = update(state);
      writeStorage();
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    reset() {
      state = initialState;
      hasReadStorage = true;
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch {
        // Nothing stored to remove.
      }
      notify();
    },
  };

  createdStores.add(store as MockStore<unknown>);
  return store;
}

/**
 * Reads a store from a client component and re-renders when it changes. The server
 * render and first client render use the initial sample data, so hydration matches.
 */
export function useMockStore<State>(store: MockStore<State>): State {
  return useSyncExternalStore(
    store.subscribe,
    store.getState,
    () => store.initialState,
  );
}

/** Puts every store back to its initial sample data, including stores not loaded on this page. */
export function resetAllMockStores() {
  for (const store of createdStores) store.reset();
  try {
    const keys = Array.from(
      { length: window.sessionStorage.length },
      (_, index) => window.sessionStorage.key(index),
    );
    for (const key of keys) {
      if (key?.startsWith(STORAGE_PREFIX))
        window.sessionStorage.removeItem(key);
    }
  } catch {
    // Storage unavailable: in-memory stores were already reset above.
  }
}
