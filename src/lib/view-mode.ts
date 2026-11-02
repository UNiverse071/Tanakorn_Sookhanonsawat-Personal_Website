import { useSyncExternalStore } from "react";

export type ViewMode = "classic" | "game";

const STORAGE_KEY = "portfolio-view-mode";
const listeners = new Set<() => void>();

// Fallback for browsers where localStorage is blocked (private windows, etc.).
let memoryMode: ViewMode = "classic";

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): ViewMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "game" || stored === "classic") return stored;
  } catch {
    // fall through to the in-memory value
  }
  return memoryMode;
}

export function setViewMode(mode: ViewMode) {
  memoryMode = mode;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore: memoryMode keeps the toggle working for this visit
  }
  listeners.forEach((l) => l());
}

/** Current interface (dashboard or game). Server renders "classic". */
export function useViewMode(): ViewMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => "classic");
}
