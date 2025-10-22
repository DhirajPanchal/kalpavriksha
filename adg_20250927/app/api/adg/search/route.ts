import { sampleTreasuryDeals } from "@/components/tdt/data";
import { NextResponse } from "next/server";
// adjust this import to your data file location
// import dataset from "@/components/adg/data"; // e.g. export default array from data.ts

type SortItem = { field: string; order: "asc" | "desc" };
type FilterItem =
  | { field: string; operator: "LIKE"; value: string }
  | { field: string; operator: "IN"; value: string[] }
  | { field: string; operator: "GT" | "LT" | "EQ"; value: number | string }
  | { field: string; operator: "RANGE"; from?: number | string; to?: number | string };

export async function POST(req: Request) {
  const body = await req.json();
  const {
    index = 0,
    size = 10,
    global = null,
    sort = [] as SortItem[],
    filters = [] as FilterItem[],
  } = body ?? {};

  // clone
  let rows = [...sampleTreasuryDeals];

  // global filter (simple "contains" across values)
  if (typeof global === "string" && global.trim()) {
    const needle = global.toLowerCase();
    rows = rows.filter((r) =>
      Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(needle))
    );
  }

  // column filters
  for (const f of filters) {
    if (f.operator === "LIKE") {
      const needle = f.value.toLowerCase();
      rows = rows.filter((r) => String((r as any)[f.field] ?? "").toLowerCase().includes(needle));
    } else if (f.operator === "IN") {
      const set = new Set(f.value);
      rows = rows.filter((r) => set.has(String((r as any)[f.field])));
    } else if (f.operator === "RANGE") {
      rows = rows.filter((r) => {
        const v = (r as any)[f.field];
        if (v == null) return false;
        // decide numeric vs date by value shape
        const n = typeof v === "number" ? v : Number(new Date(String(v)).getTime());
        const from = f.from != null ? (typeof f.from === "number" ? f.from : Number(new Date(String(f.from)).getTime())) : undefined;
        const to = f.to != null ? (typeof f.to === "number" ? f.to : Number(new Date(String(f.to)).getTime())) : undefined;
        if (from != null && n < from) return false;
        if (to != null && n > to) return false;
        return true;
      });
    } else {
      // GT/LT/EQ
      rows = rows.filter((r) => {
        const v = (r as any)[f.field];
        if (v == null) return false;
        const left = typeof v === "number" ? v : Number(new Date(String(v)).getTime());
        const right =
          typeof f.value === "number" ? f.value : Number(new Date(String(f.value)).getTime());
        if (f.operator === "GT") return left > right;
        if (f.operator === "LT") return left < right;
        return left === right; // EQ
      });
    }
  }

  // sorting (stable)
  for (let i = sort.length - 1; i >= 0; i--) {
    const s = sort[i];
    rows.sort((a: any, b: any) => {
      const av = a[s.field];
      const bv = b[s.field];
      if (av == null && bv == null) return 0;
      if (av == null) return s.order === "asc" ? -1 : 1;
      if (bv == null) return s.order === "asc" ? 1 : -1;
      if (typeof av === "number" && typeof bv === "number") {
        return s.order === "asc" ? av - bv : bv - av;
      }
      const as = String(av);
      const bs = String(bv);
      return s.order === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
  }

  // pagination
  const total = rows.length;
  const start = index * size;
  const paged = rows.slice(start, start + size);

  return NextResponse.json({ rows: paged, total });
}
