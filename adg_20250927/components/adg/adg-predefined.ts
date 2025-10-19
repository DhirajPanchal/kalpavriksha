import { AdgColorConfig } from "./adg-types";

export const RED_ADG_COLORS: AdgColorConfig = {
  header: {
    bgIdle: "bg-muted dark:bg-muted",
    bgActive: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-900 dark:text-red-200",
    border: "border-border",
    borderActive: "border-b-4 border-b-red-600",
    sortIconIdle: "text-red-500/60",
    sortIconActive: "text-red-600",
    filterIconIdle: "text-red-500/60",
    filterIconActive: "text-red-600",
    filterHover: "hover:bg-red-50 dark:hover:bg-red-900/30",
  },
  row: {
    base: "bg-background",
    zebraEven: "bg-red-50/40 dark:bg-red-950/10",
    zebraOdd: "bg-background",
    hover: "group-hover:bg-red-100/60 dark:group-hover:bg-red-900/30",
    selected: "bg-red-200/60 dark:bg-red-800/40",
    border: "border-border",
    text: "text-foreground",
  },
  columnHover: {
    overlay:
      "bg-red-200/20 dark:bg-red-900/40 ring-1 ring-inset ring-red-400/10",
  },
  popover: {
    bg: "bg-popover",
    border: "border-red-300 dark:border-red-700",
  },
};

export const BLUE_ADG_COLORS: AdgColorConfig = {
  header: {
    bgIdle: "bg-muted",
    bgActive: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-900 dark:text-blue-200",
    border: "border-border",
    borderActive: "border-b-4 border-b-blue-600",
    sortIconIdle: "text-blue-400",
    sortIconActive: "text-blue-600",
    filterIconIdle: "text-blue-400",
    filterIconActive: "text-blue-600",
    filterHover: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
  },
  row: {
    base: "bg-background",
    zebraEven: "bg-blue-50/40 dark:bg-blue-950/10",
    zebraOdd: "bg-background",
    hover: "group-hover:bg-blue-100/60 dark:group-hover:bg-blue-900/30",
    selected: "bg-blue-200/60 dark:bg-blue-800/40",
    border: "border-border",
    text: "text-foreground",
  },
  columnHover: {
    overlay: "bg-blue-200/40 dark:bg-blue-900/40 ring-1 ring-inset ring-blue-400/10",
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
    base: "bg-background",
    zebraEven: "bg-gray-50 dark:bg-gray-900/50",
    zebraOdd: "bg-background",
    hover: "group-hover:bg-gray-100 dark:group-hover:bg-gray-800",
    selected: "bg-gray-200 dark:bg-gray-700",
    border: "border-border",
    text: "text-foreground",
  },
  columnHover: {
    overlay: "bg-gray-200/40 dark:bg-gray-800/40 ring-1 ring-inset ring-gray-400/10",
  },
  popover: {
    bg: "bg-popover",
    border: "border-gray-300 dark:border-gray-700",
  },
};


export const FRUITY_ADG_COLORS: AdgColorConfig = {
  header: {
    bgIdle: "bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 dark:from-pink-900/40 dark:to-yellow-900/40",
    bgActive: "bg-gradient-to-r from-orange-200 via-yellow-200 to-green-200 dark:from-orange-900/40 dark:to-green-900/40",
    text: "text-rose-800 dark:text-rose-200",
    border: "border-border",
    borderActive: "border-b-4 border-b-orange-500",
    sortIconIdle: "text-orange-400",
    sortIconActive: "text-orange-600",
    filterIconIdle: "text-green-400",
    filterIconActive: "text-green-600",
    filterHover: "hover:bg-yellow-100 dark:hover:bg-yellow-900/40",
  },
  row: {
    base: "bg-background",
    zebraEven: "bg-orange-50/20 dark:bg-orange-950/10",
    zebraOdd: "bg-lime-50/40 dark:bg-lime-950/10",
    hover: "group-hover:bg-yellow-100/60 dark:group-hover:bg-yellow-900/40",
    selected: "bg-green-100/60 dark:bg-green-900/40",
    border: "border-border",
    text: "text-foreground",
  },
  columnHover: {
    overlay: "bg-gradient-to-b from-pink-200/20 via-orange-200/20 to-green-200/20 dark:from-pink-900/30 dark:to-green-900/30 ring-1 ring-inset ring-orange-400/10",
  },
  popover: {
    bg: "bg-popover",
    border: "border-orange-300 dark:border-orange-700",
  },
};
