import { AdgColorConfig, Density, WidthKey } from "@/components/adg/adg-types";

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

export const DEFAULT_ADG_COLORS: AdgColorConfig = {
  header: {
    bgIdle: "bg-muted",
    bgActive: "bg-blue-100",
    text: "text-foreground",
    border: "border-border",
    borderActive: "border-b-primary",
    sortIconIdle: "text-muted-foreground",
    sortIconActive: "text-primary",
    filterIconIdle: "text-muted-foreground",
    filterIconActive: "text-primary",
    filterHover: "hover:bg-accent/90",
  },
  row: {
    base: "bg-background",
    zebraEven: "bg-muted",
    zebraOdd: "bg-background",
    // hover: "group-hover:bg-primary/5",
    // selected: "bg-primary/10",
    hoverOverlay: "bg-primary/5",
    selectedOverlay: "bg-primary/10",
    border: "border-border",
    text: "text-foreground",
  },
  columnHover: {
    overlay: "bg-primary/10 ring-1 ring-inset ring-primary/10",
  },
  popover: {
    bg: "bg-popover",
    border: "border-border",
  },
};

// const yellowPlus: Partial<AdgColorConfig> = {
//   columnHover: { overlay: "bg-primary/20 ring-1 ring-inset ring-primary/40" },
// };
