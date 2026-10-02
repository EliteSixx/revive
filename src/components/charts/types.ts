export type ChartKind = "bar" | "stacked-bar" | "line";

/** Percent values are ratios between 0 and 1. */
export type ValueFormat = "percent" | "number" | "rupees";

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

/**
 * One row of chart data. A null value is missing: suppressed by default, or the
 * reason stored under missingReasonKey(seriesKey), such as "Not yet due".
 */
export type ChartDatum = Record<string, string | number | null>;

/** Key under which a row stores why a series value is missing. */
export function missingReasonKey(seriesKey: string): string {
  return `${seriesKey}MissingReason`;
}
