import { ColumnDef } from "@tanstack/react-table";
import { ColumnFilterMeta } from "./adg-filters-adv";

export type WidthKey = "S" | "M" | "L";

export type Density = "compact" | "medium" | "large";

export type PinKey = "left" | false;

export interface AdgColumnMeta {
  label?: string;
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
