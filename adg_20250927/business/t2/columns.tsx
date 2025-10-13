"use client";

import { AdgColumnDef } from "@/components/adg-v2/adg-types";
import { TreasuryDealTicket } from "./types";
import { WIDTH_MAP } from "@/components/adg-v2/adg-constants";
import { Badge } from "@/components/ui/badge";
import {
  capsuleClass,
  fmtDate,
  fmtNum,
  sideClass,
  statusClass,
} from "./helper";
import { cn } from "@/lib/utils";

export function treasuryColumns(): AdgColumnDef<TreasuryDealTicket>[] {
  return [
    {
      accessorKey: "dealId",
      header: "Deal ID",
      size: WIDTH_MAP.M,
      meta: {
        label: "Deal ID",
        defaultPin: "left",
        widthKey: "L",
        type: "string",
        align: "center",
      },
    },
    {
      accessorKey: "product",
      header: "Product 1",
      size: WIDTH_MAP.S,
      meta: {
        label: "Product",
        defaultPin: "left",
        widthKey: "L",
        type: "string",
      },
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
      meta: { label: "Side", widthKey: "L", type: "enum" }, // enum -> center by default
    },
    {
      accessorKey: "ccyPair",
      header: "CCY Pair",
      size: WIDTH_MAP.S,
      meta: {
        label: "CCY Pair",
        defaultPin: "left",
        widthKey: "L",
        type: "string",
      },
    },
    {
      accessorKey: "notional",
      header: "Notional",
      size: WIDTH_MAP.M,
      cell: ({ row }) => (
        <span className="font-mono">{fmtNum(row.original.notional)}</span>
      ),
      meta: {
        label: "Notional",
        widthKey: "L",
        type: "number",
        filter: { kind: "number" },
      },
    },
    {
      accessorKey: "rate",
      header: "Rate",
      size: WIDTH_MAP.S,
      cell: ({ row }) => (
        <span className="font-mono">{row.original.rate.toFixed(4)}</span>
      ),
      meta: { label: "Rate", widthKey: "L", type: "number" },
    },
    {
      accessorKey: "tradeDate",
      header: "Trade Date",
      size: WIDTH_MAP.M,
      cell: ({ row }) => fmtDate(row.original.tradeDate),
      meta: {
        label: "Trade Date",
        widthKey: "L",
        type: "date",
        filter: { kind: "date" },
      },
    },
    {
      accessorKey: "valueDate",
      header: "Value Date",
      size: WIDTH_MAP.M,
      cell: ({ row }) => fmtDate(row.original.valueDate),
      meta: { label: "Value Date", widthKey: "L", type: "date" },
    },
    {
      accessorKey: "desk",
      header: "Desk",
      size: WIDTH_MAP.S,
      meta: { label: "Desk", widthKey: "L", type: "string" },
    },
    {
      accessorKey: "legalEntity",
      header: "Legal Entity",
      size: WIDTH_MAP.L,
      meta: {
        label: "Legal Entity",
        widthKey: "L",
        type: "string",
        filter: { kind: "text", placeholder: "contains..." },
      },
    },
    {
      accessorKey: "region",
      header: "Region",
      size: WIDTH_MAP.S,
      meta: {
        label: "Region",
        widthKey: "L",
        type: "enum",
        filter: { kind: "enum", enumValues: ["APAC", "EMEA", "AMER"] },
      },
    },
    {
      accessorKey: "site",
      header: "Site",
      size: WIDTH_MAP.M,
      meta: { label: "Site", widthKey: "L", type: "string" },
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
      meta: { label: "Status", widthKey: "L", type: "enum" },
    },
  ];
}
