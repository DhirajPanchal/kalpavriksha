"use client";

import { treasuryColumns } from "@/business/t1/columns";
import { sampleTreasuryDeals } from "@/business/t1/data";
import AdgDataGridv1 from "@/components/adg-v1/adg-datagrid-v1";
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
      <AdgDataGridv1
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
