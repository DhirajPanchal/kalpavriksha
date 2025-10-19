import { TreasuryDealTicket } from "./types";

/**
 * Sample Data — 20 Treasury Deal Tickets (synthetic)
 */
export const sampleTreasuryDeals: TreasuryDealTicket[] = [
  { dealId: "TD001", product: "Spot", side: "Buy", ccyPair: "USD/INR", notional: 2000000, rate: 83.15, tradeDate: "2025-09-25", valueDate: "2025-09-27", desk: "FX Desk", legalEntity: "HSBC Bank India", status: "Booked", region: "APAC", site: "Mumbai " },
  { dealId: "TD002", product: "Forward", side: "Sell", ccyPair: "EUR/USD", notional: 1500000, rate: 1.0865, tradeDate: "2025-09-24", valueDate: "2025-12-24", desk: "FX Desk", legalEntity: "HSBC Bank PLC", status: "Booked", region: "EMEA", site: "London" },
  { dealId: "TD003", product: "Deposit", side: "Buy", ccyPair: "USD", notional: 3000000, rate: 4.25, tradeDate: "2025-09-23", valueDate: "2025-09-30", desk: "MM Desk", legalEntity: "HSBC Bank USA", status: "Settled", region: "AMER", site: "New York" },
  { dealId: "TD004", product: "Swap", side: "Sell", ccyPair: "GBP/USD", notional: 2500000, rate: 1.2732, tradeDate: "2025-09-22", valueDate: "2025-09-29", desk: "IR Desk", legalEntity: "HSBC Bank PLC", status: "Amended", region: "EMEA", site: "London" },
  { dealId: "TD005", product: "Spot", side: "Buy", ccyPair: "USD/JPY", notional: 1800000, rate: 149.85, tradeDate: "2025-09-21", valueDate: "2025-09-23", desk: "FX Desk", legalEntity: "HSBC Japan ASD ASD ASD ASD ASD ASD ASD ASD ASD ASD  END", status: "Booked", region: "APAC", site: "Tokyo" },
  { dealId: "TD006", product: "Forward", side: "Buy", ccyPair: "AUD/USD", notional: 1200000, rate: 0.6742, tradeDate: "2025-09-20", valueDate: "2025-12-20", desk: "FX Desk", legalEntity: "HSBC Bank Australia", status: "Booked", region: "APAC", site: "Sydney" },
  { dealId: "TD007", product: "Deposit", side: "Sell", ccyPair: "GBP", notional: 900000, rate: 5.1, tradeDate: "2025-09-19", valueDate: "2025-09-26", desk: "MM Desk", legalEntity: "HSBC Bank PLC", status: "Settled", region: "EMEA", site: "London" },
  { dealId: "TD008", product: "Spot", side: "Buy", ccyPair: "USD/CAD", notional: 2200000, rate: 1.345, tradeDate: "2025-09-18", valueDate: "2025-09-20", desk: "FX Desk", legalEntity: "HSBC Bank Canada", status: "Booked", region: "AMER", site: "Toronto" },
  { dealId: "TD009", product: "Swap", side: "Sell", ccyPair: "EUR/GBP", notional: 1700000, rate: 0.861, tradeDate: "2025-09-17", valueDate: "2025-09-24", desk: "IR Desk", legalEntity: "HSBC Bank PLC", status: "Booked", region: "EMEA", site: "London" },
  { dealId: "TD010", product: "Forward", side: "Buy", ccyPair: "USD/CHF", notional: 1600000, rate: 0.9015, tradeDate: "2025-09-16", valueDate: "2025-12-16", desk: "FX Desk", legalEntity: "HSBC Bank Switzerland", status: "Booked", region: "EMEA", site: "Zurich" },
  { dealId: "TD011", product: "Spot", side: "Sell", ccyPair: "USD/HKD", notional: 2100000, rate: 7.8345, tradeDate: "2025-09-15", valueDate: "2025-09-17", desk: "FX Desk", legalEntity: "HSBC Hong Kong", status: "Settled", region: "APAC", site: "Hong Kong" },
  { dealId: "TD012", product: "Deposit", side: "Buy", ccyPair: "EUR", notional: 1100000, rate: 3.85, tradeDate: "2025-09-14", valueDate: "2025-09-21", desk: "MM Desk", legalEntity: "HSBC Bank PLC", status: "Booked", region: "EMEA", site: "Frankfurt" },
  { dealId: "TD013", product: "Forward", side: "Sell", ccyPair: "USD/SGD", notional: 1400000, rate: 1.368, tradeDate: "2025-09-13", valueDate: "2025-12-13", desk: "FX Desk", legalEntity: "HSBC Singapore", status: "Booked", region: "APAC", site: "Singapore" },
  { dealId: "TD014", product: "Spot", side: "Buy", ccyPair: "USD/CNY", notional: 2300000, rate: 7.265, tradeDate: "2025-09-12", valueDate: "2025-09-14", desk: "FX Desk", legalEntity: "HSBC China", status: "Booked", region: "APAC", site: "Shanghai" },
  { dealId: "TD015", product: "Swap", side: "Sell", ccyPair: "USD/MXN", notional: 1950000, rate: 17.15, tradeDate: "2025-09-11", valueDate: "2025-09-18", desk: "IR Desk", legalEntity: "HSBC Mexico", status: "Booked", region: "AMER", site: "Mexico City" },
  { dealId: "TD016", product: "Forward", side: "Buy", ccyPair: "USD/BRL", notional: 1750000, rate: 5.282, tradeDate: "2025-09-10", valueDate: "2025-12-10", desk: "FX Desk", legalEntity: "HSBC Brazil", status: "Booked", region: "AMER", site: "Sao Paulo" },
  { dealId: "TD017", product: "Deposit", side: "Sell", ccyPair: "JPY", notional: 250000000, rate: 0.1, tradeDate: "2025-09-09", valueDate: "2025-09-16", desk: "MM Desk", legalEntity: "HSBC Japan", status: "Settled", region: "APAC", site: "Tokyo" },
  { dealId: "TD018", product: "Spot", side: "Buy", ccyPair: "USD/KRW", notional: 2000000, rate: 1342.5, tradeDate: "2025-09-08", valueDate: "2025-09-10", desk: "FX Desk", legalEntity: "HSBC Korea", status: "Booked", region: "APAC", site: "Seoul" },
  { dealId: "TD019", product: "Swap", side: "Sell", ccyPair: "USD/ZAR", notional: 1600000, rate: 18.72, tradeDate: "2025-09-07", valueDate: "2025-09-14", desk: "IR Desk", legalEntity: "HSBC South Africa", status: "Booked", region: "EMEA", site: "Johannesburg" },
  { dealId: "TD020", product: "Forward", side: "Buy", ccyPair: "USD/THB", notional: 1850000, rate: 36.12, tradeDate: "2025-09-06", valueDate: "2025-12-06", desk: "FX Desk", legalEntity: "HSBC Thailand", status: "Booked", region: "APAC", site: "Bangkok" },
];
