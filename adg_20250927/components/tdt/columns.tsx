"use client";

import { AdgColumnDef } from "@/components/adg/adg-types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "../ui/checkbox";

import {
  capsuleClass,
  fmtDate,
  fmtNum,
  sideClass,
  statusClass,
} from "./helper";
import { TreasuryDealTicket } from "./types";
import { cn } from "@/lib/utils";

export function treasuryColumns(): AdgColumnDef<TreasuryDealTicket>[] {
  return [
    {
      id: "select",
      header: undefined,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-2 border-gray-200"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: {
        defaultPin: true,
        widthKey: "XS",
        align: "center",
      },
    },
    {
      accessorKey: "dealId",
      header:
        "A1 A2 A3 A4 A5 A6 A7 A8 A9 A10 A11 A12 A13 A14 A15 A16 A17 A18 A19 A20",
      enableSorting: false,
      meta: {
        label: "Deal ID",
        type: "string",
        defaultPin: true,
        widthKey: "M",
        align: "center",
      },
    },
    {
      accessorKey: "product",
      header: "Product",
      meta: {
        label: "Product",
        type: "string",
        defaultPin: false,
        widthKey: "S",
        align: "center",
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
        widthKey: "M",
        type: "number",
        filter: { kind: "number", mode:"single" },
      },
    },

    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => (
        <span className="font-mono">{row.original.rate.toFixed(4)}</span>
      ),
      meta: {
        label: "Rate",
        type: "number",
        widthKey: "S",
        filter: { kind: "number", mode:"range" },
      },
    },
    {
      accessorKey: "ccyPair",
      header: "CCY Pair",
      meta: {
        label: "CCY Pair",
        defaultPin: false,
        widthKey: "M",
        type: "string",
        align: "right",
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
        widthKey: "S",
        type: "enum",
        filter: { kind: "enum", enumValues: ["Sell", "Buy"] },
      }, // enum -> center by default
    },

    {
      accessorKey: "tradeDate",
      header: "Trade Date",

      cell: ({ row }) => fmtDate(row.original.tradeDate),
      meta: {
        label: "Trade Date",
        widthKey: "M",
        type: "date",
        filter: { kind: "date", mode:"single" },
      },
    },
    {
      accessorKey: "valueDate",
      header: "Value Date",
      enableSorting:false,
      cell: ({ row }) => fmtDate(row.original.valueDate),
      meta: { label: "Value Date", widthKey: "M", type: "date", filter: { kind: "date", mode:"range" }, },
    },
    {
      accessorKey: "desk",
      header: "Desk",

      meta: { label: "Desk", widthKey: "S", type: "string" },
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
        widthKey: "S",
        type: "enum",
        filter: { kind: "enum", enumValues: ["APAC", "EMEA", "AMER"] },
      },
    },
    {
      accessorKey: "site",
      header: "Site",

      meta: { label: "Site", widthKey: "S", type: "string" },
    },
    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => (
        <Badge className={cn(statusClass[row.original.status], capsuleClass)}>
          {row.original.status}
        </Badge>
      ),
      meta: { label: "Status", widthKey: "M", type: "enum" },
    },
  ];
}
