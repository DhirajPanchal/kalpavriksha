import { AdgColorConfig } from "./adg-types";
export const RED_ADG_COLORS: AdgColorConfig = {
  header: {
    bgIdle: "bg-muted",
    bgActive: "bg-red-100 dark:bg-red-900",
    text: "text-red-900 dark:text-red-100",
    border: "border-border",
    borderActive: "border-b-4 border-b-red-600",
    sortIconIdle: "text-red-500/70",
    sortIconActive: "text-red-600",
    filterIconIdle: "text-red-500/70",
    filterIconActive: "text-red-600",
    filterHover: "hover:bg-red-50 dark:hover:bg-red-800",
  },
  row: {
    base: "bg-background",
    // OPAQUE zebra to avoid bleed on pinned
    zebraEven: "bg-red-50 dark:bg-red-950",
    zebraOdd: "bg-background dark:bg-background",
    // Overlays (can be translucent)
    hoverOverlay: "bg-red-100/50 dark:bg-red-800/40",
    selectedOverlay: "bg-red-200/50 dark:bg-red-700/40",
    border: "border-border",
    text: "text-foreground",
  },
  columnHover: {
    overlay:
      "bg-red-200/40 dark:bg-red-800/40 ring-1 ring-inset ring-red-400/10",
  },
  popover: {
    bg: "bg-popover",
    border: "border-red-300 dark:border-red-700",
  },
};

export const BLUE_ADG_COLORS: AdgColorConfig = {
  header: {
    bgIdle: "bg-muted",
    bgActive: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-900 dark:text-blue-100",
    border: "border-border",
    borderActive: "border-b-4 border-b-blue-600",
    sortIconIdle: "text-blue-500/70",
    sortIconActive: "text-blue-600",
    filterIconIdle: "text-blue-500/70",
    filterIconActive: "text-blue-600",
    filterHover: "hover:bg-blue-50 dark:hover:bg-blue-800",
  },
  row: {
    base: "bg-background",
    // OPAQUE zebra (no /opacity)
    zebraEven: "bg-blue-50 dark:bg-blue-950",
    zebraOdd: "bg-background dark:bg-background",
    // Overlays
    hoverOverlay: "bg-blue-100/50 dark:bg-blue-800/40",
    selectedOverlay: "bg-blue-200/50 dark:bg-blue-700/40",
    border: "border-border",
    text: "text-foreground",
  },
  columnHover: {
    overlay:
      "bg-blue-200/40 dark:bg-blue-800/40 ring-1 ring-inset ring-blue-400/10",
  },
  popover: {
    bg: "bg-popover",
    border: "border-blue-300 dark:border-blue-700",
  },
};

export const GRAY_ADG_COLORS: AdgColorConfig = {
  header: {
    bgIdle: "bg-muted",
    bgActive: "bg-gray-200 dark:bg-gray-800",
    text: "text-gray-800 dark:text-gray-200",
    border: "border-border",
    borderActive: "border-b-4 border-b-gray-500",
    sortIconIdle: "text-gray-400",
    sortIconActive: "text-gray-700 dark:text-gray-300",
    filterIconIdle: "text-gray-400",
    filterIconActive: "text-gray-700 dark:text-gray-300",
    filterHover: "hover:bg-gray-100 dark:hover:bg-gray-700",
  },
  row: {
    base: "bg-white",
    // OPAQUE zebra
    zebraEven: "bg-gray-100 dark:bg-gray-900",
    zebraOdd: "bg-background dark:bg-background",
    // Overlays
    hoverOverlay: "bg-gray-200/50 dark:bg-gray-700/40",
    selectedOverlay: "bg-gray-300/50 dark:bg-gray-600/40",
    border: "border-border",
    text: "text-foreground",
  },
  columnHover: {
    overlay:
      "bg-gray-200/30 dark:bg-gray-700/40 ring-1 ring-inset ring-gray-400/10",
  },
  popover: {
    bg: "bg-popover",
    border: "border-gray-300 dark:border-gray-700",
  },
};

export const FRUITY_ADG_COLORS: AdgColorConfig = {
  header: {
    bgIdle:
      "bg-gradient-to-r from-pink-100 via-orange-100 to-yellow-100 dark:from-pink-900 dark:via-orange-900 dark:to-yellow-900",
    bgActive:
      "bg-gradient-to-r from-orange-200 via-yellow-200 to-green-200 dark:from-orange-800 dark:via-yellow-800 dark:to-green-800",
    text: "text-rose-900 dark:text-rose-100",
    border: "border-border",
    borderActive: "border-b-4 border-b-orange-500",
    sortIconIdle: "text-orange-500",
    sortIconActive: "text-orange-600",
    filterIconIdle: "text-green-500",
    filterIconActive: "text-green-600",
    filterHover: "hover:bg-yellow-100/70 dark:hover:bg-yellow-800/60",
  },
  row: {
    base: "bg-background",
    // OPAQUE zebra with fruity hints
    zebraEven: "bg-orange-50 dark:bg-orange-950",
    zebraOdd: "bg-lime-50 dark:bg-lime-950",
    // Overlays
    hoverOverlay: "bg-yellow-100/50 dark:bg-yellow-800/40",
    selectedOverlay: "bg-green-100/50 dark:bg-green-800/40",
    border: "border-border",
    text: "text-foreground",
  },
  columnHover: {
    overlay:
      "bg-gradient-to-b from-pink-200/40 via-orange-200/40 to-green-200/40 dark:from-pink-800/30 dark:via-orange-800/30 dark:to-green-800/30 ring-1 ring-inset ring-orange-400/30",
  },
  popover: {
    bg: "bg-popover",
    border: "border-orange-300 dark:border-orange-700",
  },
};
