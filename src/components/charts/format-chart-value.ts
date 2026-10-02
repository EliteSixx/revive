import { formatNumber, formatPercent, formatRupees } from "@/lib/format";
import type { ValueFormat } from "./types";

export function formatChartValue(value: number, format: ValueFormat): string {
  if (format === "percent") return formatPercent(value);
  if (format === "rupees") return formatRupees(value);
  return formatNumber(value);
}
