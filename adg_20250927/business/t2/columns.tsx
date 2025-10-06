"use client";

import { AdgColumnDef } from "@/components/adg-v2/adg-types";
import { TreasuryDealTicket } from "./types";
import { WIDTH_MAP } from "@/components/adg-v2/adg-constants";
import { Badge } from "@/components/ui/badge";
import { capsuleClass, fmtDate, fmtNum, sideClass, statusClass } from "./helper";
import { cn } from "@/lib/utils";

export function treasuryColumns(): AdgColumnDef<TreasuryDealTicket>[] {
  return [
    {
      accessorKey: "dealId",
      header: "Deal ID",
      size: WIDTH_MAP.M,
      meta: { label: "Deal ID", defaultPin: "left", widthKey: "M" },
    },
    {
      accessorKey: "product",
      header: "Product",
      size: WIDTH_MAP.S,
      meta: { label: "Product", defaultPin: "left", widthKey: "S" },
    },
    {
      accessorKey: "side",
      header: "Side",
      size: WIDTH_MAP.S,
      cell: ({ row }) => (
        <Badge className={cn(sideClass[row.original.side], capsuleClass)}>
          {row.original.side}
        </Badge>

      ),
      meta: { label: "Side", widthKey: "S" },
    },
    {
      accessorKey: "ccyPair",
      header: "CCY Pair",
      size: WIDTH_MAP.S,
      meta: { label: "CCY Pair", defaultPin: "left", widthKey: "S" },
    },
    {
      accessorKey: "notional",
      header: "Notional",
      size: WIDTH_MAP.M,
      cell: ({ row }) => (
        <span className="font-mono">{fmtNum(row.original.notional)}</span>
      ),
       meta: { label: "Notional", widthKey: "M", filter: { kind: "number" },  }
    },
    {
      accessorKey: "rate",
      header: "Rate",
      size: WIDTH_MAP.S,
      cell: ({ row }) => (
        <span className="font-mono">{row.original.rate.toFixed(4)}</span>
      ),
      meta: { label: "Rate", widthKey: "S" },
    },
    {
      accessorKey: "tradeDate",
      header: "Trade Date",
      size: WIDTH_MAP.M,
      cell: ({ row }) => fmtDate(row.original.tradeDate),
       meta: { label: "Trade Date", widthKey: "M", filter: { kind: "date" } }
    },
    {
      accessorKey: "valueDate",
      header: "Value Date",
      size: WIDTH_MAP.M,
      cell: ({ row }) => fmtDate(row.original.valueDate),
      meta: { label: "Value Date", widthKey: "M" },
    },
    {
      accessorKey: "desk",
      header: "Desk",
      size: WIDTH_MAP.S,
      meta: { label: "Desk", widthKey: "S" },
    },
    {
      accessorKey: "legalEntity",
      header: "Legal Entity AND AND AND AND AND AND AND AND END",
      size: WIDTH_MAP.L,
       meta: { label: "Legal Entity", widthKey: "L", filter: { kind: "text", placeholder: "contains..." } }
    },
    {
      accessorKey: "region",
      header: "Region",
      size: WIDTH_MAP.S,
      meta: { label: "Region", widthKey: "S", filter: { kind: "enum", enumValues: ["APAC","EMEA","AMER"] } }
    },
    {
      accessorKey: "site",
      header: "Site",
      size: WIDTH_MAP.M,
      meta: { label: "Site", widthKey: "M" },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: WIDTH_MAP.S,
      cell: ({ row }) => (
        <Badge className={cn(statusClass[row.original.status], capsuleClass)}>
          {row.original.status}
        </Badge>
      ),
      meta: { label: "Status", widthKey: "S" },
    },
  ];
}
