import { ColumnDef } from "@tanstack/react-table";

export type WidthKey = "XS" | "S" | "M" | "L" | "XL";

export type Density = "compact" | "medium" | "large";

export type FilterKind = "text" | "number" | "enum" | "date";

export type AdgAlign = "left" | "center" | "right";

export type AdgDataType = "string" | "number" | "enum" | "date";

export interface ColumnFilterMeta {
  kind: FilterKind;
  enumValues?: string[];
  placeholder?: string;
}

export interface AdgColumnMeta {
  label?: string;
  type?: AdgDataType;
  align?: AdgAlign;
  defaultVisible?: boolean;
  defaultPin?: boolean;
  widthKey?: WidthKey;
  filter?: ColumnFilterMeta;
}

export type AdgColumnDef<T> = ColumnDef<T> & { meta?: AdgColumnMeta };

export interface ColumnSetting {
  id: string;
  label: string;
  visible: boolean;
  pin: boolean;
  widthKey: WidthKey;
  order: number;
}

export interface GridSettingsSnapshot {
  columns: ColumnSetting[];
  density: Density;
  headerWrap?: string;
  wrap?: string;
  headerHeight?: "short" | "medium" | "tall";
  rowsVisible?: 5 | 10 | 15 | 20 | 25;
  rowZebra?: boolean;
  rowLines?: boolean;
  enableColumnHover?: boolean;
}

// Optional color configuration (Tailwind class strings).
export type AdgColorConfig = {
  header: {
    bgIdle: string; // header cell bg (idle)
    bgActive: string; // header cell bg when sorted/filtered
    text: string; // header text color
    border: string; // vertical & bottom borders
    borderActive: string; // active bottom border (pinned/active)
    sortIconIdle: string; // chevrons (idle)
    sortIconActive: string; // chevrons (active)
    filterIconIdle: string; // funnel (idle)
    filterIconActive: string; // funnel (active)
    filterHover: string; // hover bg for filter button
  };
  row: {
    base: string; // base bg when not zebra
    zebraEven: string; // zebra even bg
    zebraOdd: string; // zebra odd bg
    hover: string; // row hover bg (applied via group-hover)
    selected: string; // selected row bg overlay
    border: string; // row separator border
    text: string; // body text color
  };
  columnHover: {
    overlay: string; // column hover overlay (bg + ring if any)
  };
  popover: {
    bg: string; // filter popover bg
    border: string; // filter popover border
  };
};
