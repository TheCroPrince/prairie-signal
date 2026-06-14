// Brand presets for the theme switcher. Each is a plausible field-service /
// supply business so the seeded orders, dispatch, and invoices read correctly
// under any skin — only the visual identity changes, not the data.
// `accent` maps to a data-accent palette in globals.css; `swatch` is the dot.
export type BrandId =
  | "prairie"
  | "cascade"
  | "ironline"
  | "redline"
  | "blueriver"
  | "evergreen";

export type Brand = {
  id: BrandId;
  name: string;
  short: string;
  monogram: string;
  accent: string;
  swatch: string;
  tagline: string;
};

export const brands: Brand[] = [
  {
    id: "prairie",
    name: "Prairie Signal Supply Co.",
    short: "Prairie Signal",
    monogram: "PS",
    accent: "amber",
    swatch: "#f2a93b",
    tagline: "Equipment distribution & field service",
  },
  {
    id: "cascade",
    name: "Cascade Field Services",
    short: "Cascade",
    monogram: "CF",
    accent: "teal",
    swatch: "#2dd4a7",
    tagline: "Mechanical & HVAC field service",
  },
  {
    id: "ironline",
    name: "Ironline Industrial Supply",
    short: "Ironline",
    monogram: "IS",
    accent: "indigo",
    swatch: "#7c83ff",
    tagline: "Industrial parts & contractor supply",
  },
  {
    id: "redline",
    name: "Redline Mechanical",
    short: "Redline",
    monogram: "RM",
    accent: "rose",
    swatch: "#fb6f92",
    tagline: "Plumbing, heating & mechanical",
  },
  {
    id: "blueriver",
    name: "Blue River Utilities",
    short: "Blue River",
    monogram: "BR",
    accent: "sky",
    swatch: "#38bdf8",
    tagline: "Water & utility field service",
  },
  {
    id: "evergreen",
    name: "Evergreen Site Services",
    short: "Evergreen",
    monogram: "ES",
    accent: "lime",
    swatch: "#9ae65c",
    tagline: "Grounds & site maintenance",
  },
];

export const defaultBrand = brands[0];

export function brandById(id: string | null | undefined): Brand {
  return brands.find((brand) => brand.id === id) ?? defaultBrand;
}
