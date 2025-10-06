"use client";

import { treasuryColumns } from "@/business/treasury/columns";
import { sampleTreasuryDeals } from "@/business/treasury/data";
import AdgDataGrid from "@/components/adg/adg-datagrid";
import { LucideLandmark } from "lucide-react";

export default function Page() {
  const branding = (
    <div className="flex px-2 gap-2">
      <LucideLandmark className="w-6 h-6 text-[#5E6584]" />
      <span className="font-medium tracking-wind text-semibold text-xl text-[#5E6584]">
        Treasury Deal Tracker
      </span>
    </div>
  );

  return (
    <div className="p-4">
      <AdgDataGrid
        columns={treasuryColumns()}
        data={sampleTreasuryDeals}
        initialSettings={{ density: "medium", palette: "blue" }}
        onSettingsChange={(s) => console.log("settings", s)}
        config={{
          toolbarLeft: branding,
        }}
      />
    </div>
  );
}
