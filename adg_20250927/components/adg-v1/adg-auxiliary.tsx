import { ColumnSizingState, Table } from "@tanstack/react-table";
import { AdgColumnDef, ColumnSetting, GridSettingsSnapshot } from "./adg-types";
import { WIDTH_MAP } from "./adg-constants";

/********************************
 * Settings Derivation Helpers
 ********************************/
export function deriveInitialSettings<T>(cols: AdgColumnDef<T>[]): ColumnSetting[] {
  return cols.map((c, i) => ({
    //id: (c.id as string) || (c.accessorKey as string) || `col_${i}`,
    id: (c.id as string) || `col_${i}`,
    //label: c.meta?.label || (typeof c.header === "string" ? (c.header as string) : (c.id as string) || String(c.accessorKey)),
    label: c.meta?.label || (typeof c.header === "string" ? (c.header as string) : (c.id as string)),
    visible: c.meta?.defaultVisible ?? true,
    pin: c.meta?.defaultPin ?? false,
    widthKey: c.meta?.widthKey ?? "M",
    order: i,
  }));
}

export function applySettingsToTable<T>(table: Table<T>, settings: GridSettingsSnapshot) {
  const idsOrdered = settings.columns.sort((a, b) => a.order - b.order).map((s) => s.id);
  table.setColumnOrder(idsOrdered);

  // sizing & visibility & pinning
  const nextSizing: ColumnSizingState = {};
  settings.columns.forEach((c) => {
    const col = table.getColumn(c.id);
    if (!col) return;
    col.toggleVisibility(c.visible);
    col.pin(c.pin);
    nextSizing[c.id] = WIDTH_MAP[c.widthKey];
  });
  table.setColumnSizing(nextSizing);
}
