import { ColumnSizingState, Table } from "@tanstack/react-table";
import { AdgColumnDef, ColumnSetting, GridSettingsSnapshot } from "./adg-types";
import { WIDTH_MAP } from "./adg-constants";

// Add this near the top of adg-datagrid-v2.tsx
import type { Row } from "@tanstack/react-table";

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




/**
 * Build a set of per-type filter functions usable by TanStack Table.
 * All fns follow: (row, columnId, filterValue) => boolean
 */
export function buildFilterFns<T>() {
  // Text: case-insensitive "includes"
  const text = (row: Row<T>, columnId: string, filterValue: string) => {
    if (!filterValue) return true;
    const v = String(row.getValue(columnId) ?? "").toLowerCase();
    return v.includes(String(filterValue).toLowerCase());
  };

  // Number: supports operators >, >=, <, <=, =N and ranges "A..B"
  const number = (row: Row<T>, columnId: string, filterValue: string) => {
    if (!filterValue) return true;
    const raw = row.getValue(columnId);
    const target = Number(raw);
    if (Number.isNaN(target)) return false;

    const q = String(filterValue).trim();

    // operator form
    const m = q.match(/^\s*([<>]=?|=)?\s*([-+]?\d+(?:\.\d+)?)\s*$/);
    if (m) {
      const op = (m[1] || "=") as ">" | "<" | ">=" | "<=" | "=";
      const num = Number(m[2]);
      switch (op) {
        case ">": return target > num;
        case "<": return target < num;
        case ">=": return target >= num;
        case "<=": return target <= num;
        default: return target === num;
      }
    }

    // range form: A..B
    const parts = q.split("..");
    if (parts.length === 2) {
      const a = Number(parts[0]);
      const b = Number(parts[1]);
      return target >= Math.min(a, b) && target <= Math.max(a, b);
    }

    // fallback: string includes on number
    return String(target).includes(q);
  };

  // Date: accepts ISO-like yyyy-mm-dd with operators or "start..end"
  const date = (row: Row<T>, columnId: string, filterValue: string) => {
    if (!filterValue) return true;
    const cell = row.getValue(columnId);
    const d = cell instanceof Date ? cell : new Date(String(cell));
    if (Number.isNaN(d.valueOf())) return false;

    const t = new Date(d); t.setHours(0, 0, 0, 0);

    const q = String(filterValue).trim();

    // operator form
    const m = q.match(/^\s*([<>]=?|=)?\s*(\d{4}-\d{2}-\d{2})\s*$/);
    if (m) {
      const op = (m[1] || "=") as ">" | "<" | ">=" | "<=" | "=";
      const qd = new Date(m[2]); qd.setHours(0, 0, 0, 0);
      switch (op) {
        case ">":  return t > qd;
        case "<":  return t < qd;
        case ">=": return t >= qd;
        case "<=": return t <= qd;
        default:   return t.getTime() === qd.getTime();
      }
    }

    // range form: yyyy-mm-dd..yyyy-mm-dd
    const parts = q.split("..");
    if (parts.length === 2) {
      const a = new Date(parts[0]); a.setHours(0, 0, 0, 0);
      const b = new Date(parts[1]); b.setHours(0, 0, 0, 0);
      const lo = a < b ? a : b;
      const hi = a < b ? b : a;
      return t >= lo && t <= hi;
    }

    // unrecognized string ⇒ don't filter out
    return true;
  };

  // Enum: comma-separated list equals any
  const enumFilter = (row: Row<T>, columnId: string, filterValue: string) => {
    if (!filterValue) return true;
    const set = new Set(
      filterValue
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    );
    const v = String(row.getValue(columnId) ?? "").toLowerCase();
    return set.size === 0 ? true : set.has(v);
  };

  return { text, number, date, enum: enumFilter };
}
