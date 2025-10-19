import { Density, WidthKey } from "@/components/adg/adg-types";

export const WIDTH_MAP: Record<WidthKey, number> = {
  XS: 80,
  S: 120,
  M: 180,
  L: 240,
  XL: 300,
};

export const DENSITY_ROW_CLASS: Record<Density, string> = {
  compact: "h-9",
  medium: "h-11",
  large: "h-14",
};
