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
  Buy: "bg-lime-200 text-gray-700",
  Sell: "bg-red-200 text-gray-700",
};

const capsuleClass:string = "rounded-sm px-3 py-1 tracking-wider text-sm";

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
