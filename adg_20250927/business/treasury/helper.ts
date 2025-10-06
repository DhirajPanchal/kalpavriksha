import { formatInTimeZone } from "date-fns-tz";
import { TreasuryDealTicket } from "./types";

/**
 * Formatters & helpers
 */
const statusClass: Record<TreasuryDealTicket["status"], string> = {
  Booked: "bg-blue-500 text-white",
  Settled: "bg-green-500 text-white",
  Amended: "bg-yellow-500 text-black",
  Cancelled: "bg-red-500 text-white",
};

const sideClass: Record<TreasuryDealTicket["side"], string> = {
  Buy: "bg-green-500 text-white",
  Sell: "bg-red-500 text-white",
};

const capsuleClass:string = "rounded-full px-2 py-0.5 tracking-wider";

// Parse YYYY-MM-DD as a UTC date-only to avoid SSR/CSR timezone drift
const parseDateOnlyUTC = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 0, 0, 0));
};

const fmtDate = (s: string) => {
  try {
    return formatInTimeZone(parseDateOnlyUTC(s), "UTC", "dd-MMM-yyyy");
  } catch {
    return s;
  }
};

// Lock to a fixed locale for consistent SSR/CSR hydration (Node + browser)
const fmtNum = (n: number, frac: number = 2) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: frac,
    maximumFractionDigits: frac,
    useGrouping: true,
  }).format(n);

export { fmtDate, fmtNum, statusClass, sideClass, capsuleClass };
