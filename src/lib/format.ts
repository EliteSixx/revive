// All user-facing number, currency, percentage and date formatting goes through
// these helpers so the whole app follows the en-IN conventions in design.md section 8.

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const integerFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatNumber(value: number): string {
  return integerFormatter.format(value);
}

export function formatRupees(value: number): string {
  return `₹${integerFormatter.format(value)}`;
}

/** `ratio` is a fraction between 0 and 1. */
export function formatPercent(ratio: number, decimals = 1): string {
  return `${(ratio * 100).toFixed(decimals)}%`;
}

/**
 * Dates are stored as ISO strings ("2026-10-02" or full timestamps) and read in UTC,
 * so the server and the browser always render the same text.
 */
function toUtcDate(isoDate: string): Date {
  return new Date(isoDate.length === 10 ? `${isoDate}T00:00:00Z` : isoDate);
}

/** "2 Oct 2026" */
export function formatDate(isoDate: string): string {
  const date = toUtcDate(isoDate);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** "Oct 2026" */
export function formatMonth(isoDate: string): string {
  const date = toUtcDate(isoDate);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
