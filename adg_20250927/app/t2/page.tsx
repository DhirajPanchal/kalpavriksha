"use client";

import AdgDataGridV2 from "@/components/adg-v2/adg-datagrid-v2";
import { treasuryColumns } from "@/business/t2/columns";
import { sampleTreasuryDeals } from "@/business/t2/data";

export default function Page() {
  return (
    <div className="p-16">
      <AdgDataGridV2
        data={sampleTreasuryDeals}
        columns={treasuryColumns()}
        initialSettings={{ density: "medium", palette: "blue" }}
        config={{ storageKey: "treasury-grid", heightPx: 560 }}
        onSettingsChange={(snapshot) => {
          // optional: send to API / Redux, etc.
          console.log("settings snapshot", snapshot);
        }}
      />
    </div>
  );
}
