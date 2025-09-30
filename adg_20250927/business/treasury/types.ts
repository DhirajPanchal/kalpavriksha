export interface TreasuryDealTicket {
  dealId: string;
  product: "Spot" | "Forward" | "Swap" | "Deposit";
  side: "Buy" | "Sell";
  ccyPair: string; // for MM Deposit, this can be a single currency like "USD"
  notional: number;
  rate: number; // FX or interest rate
  tradeDate: string; // ISO date
  valueDate: string; // ISO date
  desk: string; // FX Desk | MM Desk | IR Desk
  legalEntity: string; // HSBC entities
  status: "Booked" | "Amended" | "Settled" | "Cancelled";
  region: string; // APAC | EMEA | AMER | etc.
  site: string;   // London | Hong Kong | New York | etc.
}