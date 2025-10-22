import { ColumnDef } from "@tanstack/react-table";

export type WidthKey = "XS" | "S" | "M" | "L" | "XL";

export type Density = "compact" | "medium" | "large";

export type FilterKind = "text" | "number" | "enum" | "date";

export type FilterMode = "single" | "range" | "both"; 

export type AdgAlign = "left" | "center" | "right";

export type AdgDataType = "string" | "number" | "enum" | "date";

export interface ColumnFilterMeta {
  kind: FilterKind;
  mode?: FilterMode;
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

export type AdgDataHandlingMode = "client" | "server";


export type AdgExternalQuery = {
  index: number; // page index (0-based)
  size: number;  // page size
  global: string | null;
  sort: { field: string; order: "asc" | "desc" }[];
  filters: Array<
    | { field: string; operator: "LIKE"; value: string } // text
    | { field: string; operator: "IN"; value: string[] } // enum
    | { field: string; operator: "GT" | "LT" | "EQ"; value: number | string } // number/date single
    | { field: string; operator: "RANGE"; from?: number | string; to?: number | string } // number/date range
  >;
};

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
    // hover: string; // row hover bg (applied via group-hover)
    // selected: string; // selected row bg overlay
    hoverOverlay: string; // e.g., "bg-primary/5"
    selectedOverlay: string; // e.g., "bg-primary/10"

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
