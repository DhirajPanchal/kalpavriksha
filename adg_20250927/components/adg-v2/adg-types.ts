import { ColumnDef } from "@tanstack/react-table";


export type WidthKey = "S" | "M" | "L";

export type Density = "compact" | "medium" | "large";

export type PinKey = "left" | false;
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
  headerAlign?: AdgAlign;
  defaultVisible?: boolean;
  defaultPin?: PinKey;
  widthKey?: WidthKey;
  filter?:ColumnFilterMeta;
}

export type AdgColumnDef<T> = ColumnDef<T> & { meta?: AdgColumnMeta };

export interface ColumnSetting {
  id: string;
  label: string;
  visible: boolean;
  pin: PinKey;
  widthKey: WidthKey;
  order: number;
}

export interface GridSettingsSnapshot {
  columns: ColumnSetting[];
  density: Density;
  palette: "blue" | "gray";
  headerWrap?:string;
  align?:string;
  wrap?:string;
  headerHeight?: "short" | "medium" | "tall";
}
