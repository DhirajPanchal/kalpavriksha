import { Density, WidthKey } from "@/components/adg-v2/adg-types";

export const WIDTH_MAP: Record<WidthKey, number> = { S: 120, M: 180, L: 240 };

export const DENSITY_ROW_CLASS: Record<Density, string> = {
  compact: "h-9",
  medium: "h-11",
  large: "h-14",
};

