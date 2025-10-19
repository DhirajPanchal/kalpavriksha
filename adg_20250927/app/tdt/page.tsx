"use client";

import AdgDataGrid from "@/components/adg/adg-datagrid";
import { treasuryColumns } from "@/components/tdt/columns";
import { sampleTreasuryDeals } from "@/components/tdt/data";
import { TreasuryDealTicket } from "@/components/tdt/types";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { LandmarkIcon } from "lucide-react";
import { useState } from "react";

const branding = (
  <div className="flex flex-row gat-2 px-1 items-center text-[#5E6584]">
    <LandmarkIcon className="w-7 h-7" />
    <span className="font-medium text-xl text-semibold tracking-wide">
      Treasury Deals Tracker
    </span>
  </div>
);

export default function Page() {
  const [busy, setBusy] = useState<{
    loading: boolean;
    error: boolean;
    success: boolean;
  }>({
    loading: false,
    error: false,
    success: false,
  });

  function myFn(original: TreasuryDealTicket): void {
    console.log(original);
  }

  return (
    <div className="p-16">
      <AdgDataGrid
        data={sampleTreasuryDeals}
        columns={treasuryColumns()}
        initialSettings={{
          density: "medium",
          rowsVisible: 10,
          rowZebra: true,
          rowLines: false,
        }}
        config={{
          storageKey: "treasury-grid",
          heightPx: 560,
          toolbarLeft: branding,
        }}
        onSettingsChange={(snapshot) => {
          console.log("settings snapshot", snapshot);
        }}
        rowContextMenu={(row) => (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => myFn(row.original)}>
              Do something
            </ContextMenuItem>
          </>
        )}
        onRowDoubleClick={(record) => {
          console.log("Double-clicked:", record);
        }}
        busy={busy}
      />
    </div>
  );
}
