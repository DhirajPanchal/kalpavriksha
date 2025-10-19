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
