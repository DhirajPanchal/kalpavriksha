"use client";

import { AdgColumnDef } from "@/components/adg-v2/adg-types";
import { TreasuryDealTicket } from "./types";
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

      meta: {
        label: "Deal ID",
        defaultPin: false,
        widthKey: "L",
        type: "string",
        align: "center",
        filter: { kind: "text" },
      },
    },
    {
      accessorKey: "product",
      header: "Product",

      meta: {
        label: "Product",
        defaultPin: false,
        widthKey: "L",
        type: "string",
        filter: { kind: "text" },
      },
    },
    {
      accessorKey: "side",
      header: "Side",

      cell: ({ row }) => (
        <Badge className={cn(sideClass[row.original.side], capsuleClass)}>
          {row.original.side}
        </Badge>
      ),
      meta: {
        label: "Side",
        widthKey: "L",
        type: "enum",
        filter: { kind: "enum", enumValues: ["Sell", "Buy"] },
      }, // enum -> center by default
    },
    {
      accessorKey: "ccyPair",
      header: "CCY Pair",

      meta: {
        label: "CCY Pair",
        defaultPin: false,
        widthKey: "L",
        type: "string",
        filter: { kind: "text" },
      },
    },
    {
      accessorKey: "notional",
      header: "Notional",

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

      cell: ({ row }) => (
        <span className="font-mono">{row.original.rate.toFixed(4)}</span>
      ),
      meta: { label: "Rate", widthKey: "L", type: "number" },
    },
    {
      accessorKey: "tradeDate",
      header: "Trade Date",

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

      cell: ({ row }) => fmtDate(row.original.valueDate),
      meta: { label: "Value Date", widthKey: "L", type: "date" },
    },
    {
      accessorKey: "desk",
      header: "Desk",

      meta: { label: "Desk", widthKey: "L", type: "string" },
    },
    {
      accessorKey: "legalEntity",
      header: "Legal Entity",

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

      meta: { label: "Site", widthKey: "L", type: "string" },
    },
    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => (
        <Badge className={cn(statusClass[row.original.status], capsuleClass)}>
          {row.original.status}
        </Badge>
      ),
      meta: { label: "Status", widthKey: "L", type: "enum" },
    },
  ];
}
