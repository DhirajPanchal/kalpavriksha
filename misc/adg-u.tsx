AdgGridV2.tsx


Toolbar has a Settings (gear) button (replacing the old “Columns” dropdown).
Settings opens a Dialog with a vertical list of columns:
[Name] [Show/Hide] [Pin: Left/Right/None] [Width: S | M | L] [Move Up/Down] (+ a drag handle placeholder to swap for DnD later).
Apply closes the dialog, updates the grid (visibility, order, pin, width), and fires onSettingsChange(snapshot) for you to persist in Redux/localStorage/DB.
Cancel just closes the dialog without changing the live grid.
Row height (density) toggle: compact / medium / large.
Palette toggle: blue / gray (light/dark friendly). Easy for you to expand later.

import AdgGridV2, { DemoTreasuryGrid } from "@/components/adg/AdgGridV2";

// Option A: with your own rows/columns
<AdgGridV2
  data={rows}
  columns={columns} // columns are AdgColumnDef<T> and include meta defaults
  initialSettings={{ density: "medium", palette: "blue" }}
  onSettingsChange={(snapshot) => {
    // snapshot: { columns: [...], density, palette }
    // Persist if you want (redux/localStorage/API); grid stays unopinionated.
  }}
/>

// Option B: quick demo
<DemoTreasuryGrid rows={treasuryDeals} />


What’s inside (high level)

ColumnDef wrapper: AdgColumnDef<T> with meta:

label, defaultVisible, defaultPin, widthKey (S/M/L).

Width keys map to px via WIDTH_MAP = { S:120, M:180, L:240 } (tweak here to change global column buckets).

Settings snapshot shape (what you can persist):

type GridSettingsSnapshot = {
  columns: Array<{ id; label; visible; pin; widthKey; order }>;
  density: "compact" | "medium" | "large";
  palette: "blue" | "gray";
}


Apply behavior: Rebuilds columnOrder, updates columnSizing, toggles visibility, and sets pinning (single-table sticky columns; no split).
Sticky columns (no gap): Uses TanStack’s getStart('left')/getAfter('right') offsets and applies bg-background to pinned cells/headers to avoid the visual gap.
Deterministic formatting:
Numbers via Intl.NumberFormat('en-US')
Dates as UTC date-only with date-fns-tz to avoid SSR hydration mismatches.
Why this fixes your earlier pain
No header clutter—sorting/filtering UI can live on the header, while management moves to the dialog.
Widths are real: we set columnSizing directly and respect it on both <th> and <td> via style={{ width: column.getSize() }}. If total width exceeds the viewport, the wrapper’s overflow-auto gives you a true horizontal scrollbar (not proportional squish).
Pinning is single-table sticky (no split panes), so no “gap” between frozen and scrollable columns.


Next steps (pick one and I’ll wire it in)
Drag & drop reorder in the Settings dialog using @dnd-kit/sortable instead of Up/Down buttons.
Persisted settings example (Redux slice + localStorage fallback).
Row virtualization with @tanstack/react-virtual for 10k+ rows.
Per-column filter builders (text/enum/date/number) to be added later without crowding the header.
