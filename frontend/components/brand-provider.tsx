"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { brandById, defaultBrand, type Brand, type BrandId } from "@/lib/brands";

export type Mode = "dark" | "light";

type Appearance = { brand: BrandId; mode: Mode };

type AppearanceContextValue = {
  brand: Brand;
  mode: Mode;
  setBrand: (id: BrandId) => void;
  setMode: (mode: Mode) => void;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);
const STORAGE_KEY = "demo-appearance";
const DEFAULT: Appearance = { brand: defaultBrand.id, mode: "dark" };

// External store over localStorage so appearance survives reloads without a
// setState-in-effect, and stays in sync across tabs.
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(DEFAULT);
}

function getServerSnapshot() {
  return JSON.stringify(DEFAULT);
}

function parse(raw: string): Appearance {
  try {
    const value = JSON.parse(raw) as Partial<Appearance>;
    return {
      brand: value.brand ?? DEFAULT.brand,
      mode: value.mode === "light" ? "light" : "dark",
    };
  } catch {
    return DEFAULT;
  }
}

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const appearance = parse(raw);
  const brand = brandById(appearance.brand);
  const mode = appearance.mode;

  // Re-skin the whole document along both appearance axes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-tween");
    root.dataset.accent = brand.accent;
    root.dataset.mode = mode;
  }, [brand.accent, mode]);

  const write = useCallback((next: Appearance) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    listeners.forEach((listener) => listener());
  }, []);

  const setBrand = useCallback(
    (id: BrandId) => write({ ...parse(getSnapshot()), brand: id }),
    [write],
  );
  const setMode = useCallback(
    (next: Mode) => write({ ...parse(getSnapshot()), mode: next }),
    [write],
  );

  return (
    <AppearanceContext.Provider value={{ brand, mode, setBrand, setMode }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useBrand must be used within BrandProvider");
  return ctx;
}
