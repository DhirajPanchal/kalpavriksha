"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
  Table,
} from "@tanstack/react-table";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
import { cn } from "@/lib/utils"; // replace with your cn helper
import { ChevronDown, GripVertical, Eye, EyeOff, Snowflake, Pin, PinOff, MoveVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/*********************
 * Types & constants  *
 *********************/
export type WidthKey = "S" | "M" | "L";
const WIDTH_MAP: Record<WidthKey, number> = { S: 120, M: 180, L: 240 };

export type Density = "compact" | "medium" | "large";
const DENSITY_ROW_CLASS: Record<Density, string> = {
  compact: "h-9",
  medium: "h-11",
  large: "h-14",
};

export type PinKey = "left" | "right" | false;

export interface AdgColumnMeta {
  /** Text to show in Settings list */
  label?: string;
  /** Default visibility */
  defaultVisible?: boolean;
  /** Default pin state */
  defaultPin?: PinKey;
  /** Default width bucket */
  widthKey?: WidthKey;
}

export type AdgColumnDef<T> = ColumnDef<T> & { meta?: AdgColumnMeta };

export interface ColumnSetting {
  id: string;
  label: string;
  visible: boolean;
  pin: PinKey;
  widthKey: WidthKey;
  order: number; // stable ordering index
}

export interface GridSettingsSnapshot {
  columns: ColumnSetting[];
  density: Density;
  palette: "blue" | "gray";
}

/********************************
 * Sample business row (Treasury)
 ********************************/
export interface TreasuryDealTicket {
  dealId: string;
  product: "Spot" | "Forward" | "Swap" | "Deposit";
  side: "Buy" | "Sell";
  ccyPair: string; // or single ccy for MM
  notional: number;
  rate: number;
  tradeDate: string; // YYYY-MM-DD
  valueDate: string; // YYYY-MM-DD
  desk: string;
  legalEntity: string;
  status: "Booked" | "Amended" | "Settled" | "Cancelled";
  region: string;
  site: string;
}

const parseDateOnlyUTC = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 0, 0, 0));
};

const fmtDate = (s: string) => {
  try {
    return formatInTimeZone(parseDateOnlyUTC(s), "UTC", "dd-MMM-yyyy");
  } catch {
    return s;
  }
};

const fmtNum = (n: number, frac: number = 2) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: frac,
    maximumFractionDigits: frac,
    useGrouping: true,
  }).format(n);

const STATUS_CLASS: Record<TreasuryDealTicket["status"], string> = {
  Booked: "bg-blue-500 text-white",
  Settled: "bg-green-500 text-white",
  Amended: "bg-yellow-500 text-black",
  Cancelled: "bg-red-500 text-white",
};

/********************************
 * Columns (with meta defaults)
 ********************************/
export function treasuryColumns(): AdgColumnDef<TreasuryDealTicket>[] {
  return [
    { accessorKey: "dealId", header: "Deal ID", size: WIDTH_MAP.M, meta: { label: "Deal ID", defaultPin: "left", widthKey: "M" } },
    { accessorKey: "product", header: "Product", size: WIDTH_MAP.S, meta: { label: "Product", defaultPin: "left", widthKey: "S" } },
    { accessorKey: "side", header: "Side", size: WIDTH_MAP.S, cell: ({ row }) => <Badge>{row.original.side}</Badge>, meta: { label: "Side", widthKey: "S" } },
    { accessorKey: "ccyPair", header: "CCY Pair", size: WIDTH_MAP.S, meta: { label: "CCY Pair", defaultPin: "left", widthKey: "S" } },
    { accessorKey: "notional", header: "Notional", size: WIDTH_MAP.M, cell: ({ row }) => <span className="font-mono">{fmtNum(row.original.notional)}</span>, meta: { label: "Notional", defaultPin: "left", widthKey: "M" } },
    { accessorKey: "rate", header: "Rate", size: WIDTH_MAP.S, cell: ({ row }) => <span className="font-mono">{row.original.rate.toFixed(4)}</span>, meta: { label: "Rate", widthKey: "S" } },
    { accessorKey: "tradeDate", header: "Trade Date", size: WIDTH_MAP.M, cell: ({ row }) => fmtDate(row.original.tradeDate), meta: { label: "Trade Date", widthKey: "M" } },
    { accessorKey: "valueDate", header: "Value Date", size: WIDTH_MAP.M, cell: ({ row }) => fmtDate(row.original.valueDate), meta: { label: "Value Date", widthKey: "M" } },
    { accessorKey: "desk", header: "Desk", size: WIDTH_MAP.S, meta: { label: "Desk", widthKey: "S" } },
    { accessorKey: "legalEntity", header: "Legal Entity", size: WIDTH_MAP.L, meta: { label: "Legal Entity", widthKey: "L" } },
    { accessorKey: "region", header: "Region", size: WIDTH_MAP.S, meta: { label: "Region", widthKey: "S" } },
    { accessorKey: "site", header: "Site", size: WIDTH_MAP.M, meta: { label: "Site", widthKey: "M" } },
    { accessorKey: "status", header: "Status", size: WIDTH_MAP.S, cell: ({ row }) => <Badge className={STATUS_CLASS[row.original.status]}>{row.original.status}</Badge>, meta: { label: "Status", widthKey: "S" } },
  ];
}

/********************************
 * Settings Derivation Helpers
 ********************************/
function deriveInitialSettings<T>(cols: AdgColumnDef<T>[]): ColumnSetting[] {
  return cols.map((c, i) => ({
    id: (c.id as string) || (c.accessorKey as string) || `col_${i}`,
    label: c.meta?.label || (typeof c.header === "string" ? (c.header as string) : (c.id as string) || String(c.accessorKey)),
    visible: c.meta?.defaultVisible ?? true,
    pin: c.meta?.defaultPin ?? false,
    widthKey: c.meta?.widthKey ?? "M",
    order: i,
  }));
}

function applySettingsToTable<T>(table: Table<T>, settings: GridSettingsSnapshot) {
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

/**********************
 * Settings UI (Dialog)
 **********************/
function SettingsDialog<T>({
  open,
  onOpenChange,
  table,
  draft,
  setDraft,
  onApply,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  table: Table<T>;
  draft: GridSettingsSnapshot;
  setDraft: (s: GridSettingsSnapshot) => void;
  onApply: () => void;
}) {
  const move = (id: string, dir: "up" | "down") => {
    const arr = [...draft.columns];
    const idx = arr.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const swapWith = dir === "up" ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= arr.length) return;
    const tmp = arr[idx].order;
    arr[idx].order = arr[swapWith].order;
    arr[swapWith].order = tmp;
    arr.sort((a, b) => a.order - b.order);
    setDraft({ ...draft, columns: arr });
  };

  const setAllVisibility = (v: boolean) =>
    setDraft({ ...draft, columns: draft.columns.map((c) => ({ ...c, visible: v })) });

  const unpinAll = () =>
    setDraft({ ...draft, columns: draft.columns.map((c) => ({ ...c, pin: false })) });

  const headerLabel = (id: string) => table.getColumn(id)?.columnDef.header;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Manage Columns</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">Reorder, resize, freeze, hide/show</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setAllVisibility(true)}>Show all</Button>
            <Button variant="ghost" size="sm" onClick={unpinAll}>Unfreeze all</Button>
          </div>
        </div>
        <Separator className="my-2" />

        {/* Density & palette */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Row height</span>
            <div className="flex rounded-md border overflow-hidden">
              {(["compact","medium","large"] as Density[]).map((d) => (
                <button key={d}
                  className={cn("px-3 py-1 text-sm", draft.density===d?"bg-primary text-primary-foreground":"bg-background hover:bg-accent")}
                  onClick={() => setDraft({ ...draft, density: d })}
                >{d}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Palette</span>
            <div className="flex rounded-md border overflow-hidden">
              {["blue","gray"].map((p) => (
                <button key={p}
                  className={cn("px-3 py-1 text-sm capitalize", draft.palette===p?"bg-primary text-primary-foreground":"bg-background hover:bg-accent")}
                  onClick={() => setDraft({ ...draft, palette: p as any })}
                >{p}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-h-[50dvh] overflow-y-auto mt-3 pr-1">
          <ul className="space-y-2">
            {draft.columns.sort((a,b)=>a.order-b.order).map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-lg border bg-card p-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{typeof headerLabel(c.id) === "string" ? (headerLabel(c.id) as string) : c.label}</div>
                </div>

                {/* Show/Hide */}
                <Button variant={c.visible?"secondary":"outline"} size="icon" title={c.visible?"Visible":"Hidden"}
                  onClick={() => setDraft({ ...draft, columns: draft.columns.map(x=>x.id===c.id?{...x, visible:!x.visible}:x) })}
                >{c.visible? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}</Button>

                {/* Freeze */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" title="Freeze/Pin">
                      {c.pin ? <Pin className="h-4 w-4"/> : <PinOff className="h-4 w-4"/>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Pin</DropdownMenuLabel>
                    <DropdownMenuItem onClick={()=> setDraft({ ...draft, columns: draft.columns.map(x=>x.id===c.id?{...x, pin:"left"}:x) })}>Left</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> setDraft({ ...draft, columns: draft.columns.map(x=>x.id===c.id?{...x, pin:"right"}:x) })}>Right</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> setDraft({ ...draft, columns: draft.columns.map(x=>x.id===c.id?{...x, pin:false}:x) })}>None</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Width */}
                <div className="flex items-center gap-1 rounded-md border p-1">
                  {(["S","M","L"] as WidthKey[]).map((w)=> (
                    <button key={w} className={cn("h-8 w-8 text-xs rounded", c.widthKey===w?"bg-primary text-primary-foreground":"hover:bg-accent")}
                      onClick={()=> setDraft({ ...draft, columns: draft.columns.map(x=>x.id===c.id?{...x, widthKey:w}:x) })}
                    >{w}</button>
                  ))}
                </div>

                {/* Order */}
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" onClick={()=>move(c.id,"up")} title="Move up"><MoveVertical className="h-4 w-4 rotate-180"/></Button>
                  <Button variant="outline" size="icon" onClick={()=>move(c.id,"down")} title="Move down"><MoveVertical className="h-4 w-4"/></Button>
                </div>

                {/* drag handle placeholder */}
                <div className="px-1 text-muted-foreground"><GripVertical className="h-4 w-4"/></div>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={()=> onOpenChange(false)}>Cancel</Button>
          <Button onClick={onApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/*******************
 * Toolbar (Settings)
 *******************/
function GridToolbar<T>({
  globalFilter,
  setGlobalFilter,
  table,
  openSettings,
  setOpenSettings,
}: {
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  table: Table<T>;
  openSettings: boolean;
  setOpenSettings: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2">
      <Input
        placeholder="Filter across columns..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="h-9 w-[260px]"
      />

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Rows:</span>
          <select
            className="h-9 rounded-md border bg-background px-2"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((ps) => (
              <option key={ps} value={ps}>{ps}</option>
            ))}
          </select>
        </div>
        <Button variant="outline" className="h-9" onClick={()=> setOpenSettings(true)}>
          Settings <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/*******************
 * Pagination footer
 *******************/
function GridPagination<T>({ table }: { table: Table<T> }) {
  const page = table.getState().pagination.pageIndex + 1;
  const count = table.getPageCount() || 1;
  const total = table.getPrePaginationRowModel().rows.length;
  const pageSize = table.getState().pagination.pageSize;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between p-2 text-sm">
      <div className="text-muted-foreground">{first}–{last} of {total}</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={()=>table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>First</Button>
        <Button variant="outline" size="sm" onClick={()=>table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
        <span>Page {page} / {count}</span>
        <Button variant="outline" size="sm" onClick={()=>table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        <Button variant="outline" size="sm" onClick={()=>table.setPageIndex(Math.max(count-1,0))} disabled={!table.getCanNextPage()}>Last</Button>
      </div>
    </div>
  );
}

/*******************
 * Main Grid V2
 *******************/
export default function AdgGridV2<T>({
  data,
  columns,
  initialSettings,
  onSettingsChange,
}: {
  data: T[];
  columns: AdgColumnDef<T>[];
  initialSettings?: Partial<GridSettingsSnapshot>;
  onSettingsChange?: (s: GridSettingsSnapshot) => void;
}) {
  // table states
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({ left: [], right: [] });
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);

  // settings state (draft in dialog)
  const baseSettings: GridSettingsSnapshot = React.useMemo(() => ({
    columns: deriveInitialSettings(columns),
    density: initialSettings?.density ?? "medium",
    palette: initialSettings?.palette ?? "blue",
  }), [columns]);

  const [settings, setSettings] = React.useState<GridSettingsSnapshot>(baseSettings);
  const [draft, setDraft] = React.useState<GridSettingsSnapshot>(settings);
  const [openSettings, setOpenSettings] = React.useState(false);

  const table = useReactTable({
    data,
    columns: columns.map((c, i) => ({ ...c, id: (c.id as string) || (c.accessorKey as string) || `col_${i}` })),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      columnPinning,
      columnSizing,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    enableRowSelection: true,
  });

  // Apply current settings to the table on mount & when settings change
  React.useEffect(() => {
    applySettingsToTable(table, settings);
    // derive pinning arrays from settings
    const left = settings.columns.filter(c=>c.pin==="left").sort((a,b)=>a.order-b.order).map(c=>c.id);
    const right = settings.columns.filter(c=>c.pin==="right").sort((a,b)=>a.order-b.order).map(c=>c.id);
    setColumnPinning({ left, right });
    // let parent know
    onSettingsChange?.(settings);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(settings)]);

  const paletteClass = settings.palette === "blue"
    ? "[--adg-head:bg:theme(colors.blue.50)] dark:[--adg-head:bg:theme(colors.blue.950)]"
    : "[--adg-head:bg:theme(colors.gray.50)] dark:[--adg-head:bg:theme(colors.gray.900)]";

  const densityRow = DENSITY_ROW_CLASS[settings.density];

  return (
    <div className={cn("w-full rounded-xl border bg-card text-card-foreground shadow-sm", paletteClass)}>
      <GridToolbar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        table={table}
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
      />

      {/* Settings dialog */}
      <SettingsDialog
        open={openSettings}
        onOpenChange={(v)=>{ setOpenSettings(v); if(!v) setDraft(settings); }}
        table={table}
        draft={draft}
        setDraft={setDraft}
        onApply={()=>{ setSettings(draft); setOpenSettings(false); }}
      />

      {/* Scroll container */}
      <div className="overflow-auto">
        <UiTable className="min-w-[1000px]">
          <TableHeader className="sticky top-0 z-10 bg-[var(--adg-head:bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--adg-head:bg)]/70">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: header.column.getIsPinned() ? ("sticky" as const) : undefined,
                      left: header.column.getIsPinned() ? header.column.getStart("left") : undefined,
                      right: header.column.getIsPinned() ? header.column.getAfter("right") : undefined,
                      zIndex: header.column.getIsPinned() ? 3 : undefined,
                    }}
                    className={cn("relative font-semibold align-middle group border-r",
                      header.column.getIsPinned() && "shadow-[inset_-1px_0_0_theme(colors.border)] bg-background")}
                  >
                    {header.isPlaceholder ? null : (
                      <div className={header.column.getCanSort()?"cursor-pointer select-none":""}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}

                    {/* Resize handle */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
                          "bg-transparent hover:bg-border",
                          header.column.getIsResizing() && "bg-primary"
                        )}
                        style={{ transform: "translateX(50%)" }}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}
                  className={cn(densityRow, row.original && (row as any).original.status === "Cancelled" && "bg-destructive/5 hover:bg-destructive/10")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{
                      width: cell.column.getSize(),
                      position: cell.column.getIsPinned() ? ("sticky" as const) : undefined,
                      left: cell.column.getIsPinned() ? cell.column.getStart("left") : undefined,
                      right: cell.column.getIsPinned() ? cell.column.getAfter("right") : undefined,
                      zIndex: cell.column.getIsPinned() ? 2 : undefined,
                      background: cell.column.getIsPinned() ? "var(--background)" : undefined,
                    }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </UiTable>
      </div>

      <GridPagination table={table} />
    </div>
  );
}

/*******************
 * Simple demo usage
 *******************/
export function DemoTreasuryGrid({ rows }: { rows: TreasuryDealTicket[] }) {
  const cols = React.useMemo(() => treasuryColumns(), []);
  return (
    <AdgGridV2
      data={rows}
      columns={cols}
      initialSettings={{ density: "medium", palette: "blue" }}
      onSettingsChange={(s)=>console.log("settings", s)}
    />
  );
}
