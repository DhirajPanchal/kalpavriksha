"use client";

import { treasuryDealColumns } from "@/business/treasury/columns";
import { sampleTreasuryDeals } from "@/business/treasury/data";
import AdgDataGrid from "@/components/adg/adg-datagrid";
import TreasuryDealsGrid from "@/components/adg/adg-datagrid";
import { LucideLandmark } from "lucide-react";

export default function Page() {
  const branding = (
    <div className="flex px-2 gap-2">
      <LucideLandmark className="w-6 h-6 text-sky-600"/>
      <span className="font-medium tracking-wind text-semibold text-xl text-sky-600">Treasury Deal Tracker</span>
    </div>
  );

  return (
    <div className="p-4">
      <AdgDataGrid
        columns={treasuryDealColumns}
        data={sampleTreasuryDeals}
        config={{
          toolbarLeft: branding,
        }}
      />
    </div>
  );
}
