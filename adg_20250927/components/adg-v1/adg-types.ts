import { ColumnDef } from "@tanstack/react-table";

export type WidthKey = "S" | "M" | "L";

export type Density = "compact" | "medium" | "large";

export type PinKey = "left" | "right" | false;

export interface AdgColumnMeta {
  label?: string;
  defaultVisible?: boolean;
  defaultPin?: PinKey;
  widthKey?: WidthKey;
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
}
