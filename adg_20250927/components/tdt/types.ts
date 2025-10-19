export interface TreasuryDealTicket {
  dealId: string;
  product: "Spot" | "Forward" | "Swap" | "Deposit";
  side: "Buy" | "Sell";
  ccyPair: string;
  notional: number;
  rate: number;
  tradeDate: string;
  valueDate: string;
  desk: string;
  legalEntity: string; // HSBC entities
  status: "Booked" | "Amended" | "Settled" | "Cancelled";
  region: string;
  site: string;
}
