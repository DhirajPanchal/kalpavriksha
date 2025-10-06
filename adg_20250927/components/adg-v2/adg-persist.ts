
/**
 * Persisted settings example: Redux slice + localStorage helpers.
 * You can use either, or both together.
 */
"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GridSettingsSnapshot } from "./adg-types";
//import type { GridSettingsSnapshot } from "./adg-types";

export interface AdgPrefsState {
  byKey: Record<string, GridSettingsSnapshot | undefined>;
}

const initialState: AdgPrefsState = { byKey: {} };

export const adgPrefsSlice = createSlice({
  name: "adgPrefs",
  initialState,
  reducers: {
    setGridSettings: (state, action: PayloadAction<{ key: string; settings: GridSettingsSnapshot }>) => {
      state.byKey[action.payload.key] = action.payload.settings;
    },
    clearGridSettings: (state, action: PayloadAction<{ key: string }>) => {
      delete state.byKey[action.payload.key];
    },
  },
});

export const { setGridSettings, clearGridSettings } = adgPrefsSlice.actions;
export const adgPrefsReducer = adgPrefsSlice.reducer;

// Selector factory
export const selectGridSettings = (key: string) => (state: { adgPrefs: AdgPrefsState }) =>
  state.adgPrefs.byKey[key];

// ---- LocalStorage helpers (fallback if Redux not present) ----

const STORAGE_PREFIX = "adg:prefs:";

export function saveSettingsToStorage(key: string, settings: GridSettingsSnapshot) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(settings));
  } catch {}
}

export function loadSettingsFromStorage(key: string): GridSettingsSnapshot | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as GridSettingsSnapshot) : undefined;
  } catch {
    return undefined;
  }
}
