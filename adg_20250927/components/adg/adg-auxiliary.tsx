import { ColumnSizingState, Table } from "@tanstack/react-table";
import { AdgColumnDef, ColumnSetting, GridSettingsSnapshot } from "./adg-types";
import { WIDTH_MAP } from "./adg-constants";


import type { Row } from "@tanstack/react-table";


export function deriveInitialSettings<T>(
  cols: AdgColumnDef<T>[]
): ColumnSetting[] {
  return cols.map((c, i) => ({
    id: ((c as any).accessorKey as string) || ((c.id as string) ?? `col_${i}`),
    label:
      c.meta?.label ||
      (typeof c.header === "string"
        ? (c.header as string)
        : ((c as any).accessorKey as string) || (c.id as string) || `col_${i}`),
    visible: c.meta?.defaultVisible ?? true,
    pin: c.meta?.defaultPin ?? false,
    widthKey: c.meta?.widthKey ?? "M",
    order: i,
  }));
}

export function applySettingsToTable<T>(
  table: Table<T>,
  settings: GridSettingsSnapshot
) {
  const all = table.getAllColumns();
  const resolveCol = (id: string) =>
    all.find(
      (c) =>
        c.id === id ||
        ((c.columnDef as any)?.accessorKey as string | undefined) === id
    );


  const idsOrdered = settings.columns
    .sort((a, b) => a.order - b.order)
    .map((s) => resolveCol(s.id)?.id ?? s.id);
  table.setColumnOrder(idsOrdered);


  const nextSizing: ColumnSizingState = {};
  settings.columns.forEach((s) => {
    const col = resolveCol(s.id);
    if (!col) return; // unknown/removed column: skip gracefully
    col.toggleVisibility(s.visible);
    col.pin(s.pin ? "left" : false);
    nextSizing[col.id] = WIDTH_MAP[s.widthKey];
  });
  table.setColumnSizing(nextSizing);
}

