import type { Column } from "@/components/ui/table";
import { formatRupees } from "@/lib/format";
import {
  computeOutcomeRates,
  formatRate,
  formatReportCount,
  NOT_YET_DUE_LABEL,
  suppressMedian,
  SUPPRESSED_LABEL,
} from "@/lib/metrics";
import type { OutcomeCounts } from "@/types/analytics";

/**
 * Standard outcome columns for comparison tables (providers, districts, courses,
 * cohorts, demographic groups). Every rate uses src/lib/metrics.ts.
 */
export function outcomeColumns<Row>(
  getCounts: (row: Row) => OutcomeCounts,
): Column<Row>[] {
  const rateCell = (value: string | null) => value ?? SUPPRESSED_LABEL;

  return [
    {
      key: "certified",
      header: "Certified",
      align: "right",
      cell: (row) => formatReportCount(getCounts(row).certified),
    },
    {
      key: "verified-placement",
      header: "Verified placement (W3)",
      align: "right",
      cell: (row) =>
        rateCell(
          formatRate(computeOutcomeRates(getCounts(row)).verifiedPlacementRate),
        ),
    },
    {
      key: "placement",
      header: "Placement (W3)",
      align: "right",
      cell: (row) =>
        rateCell(formatRate(computeOutcomeRates(getCounts(row)).placementRate)),
    },
    {
      key: "retention-w6",
      header: "Retention (W6)",
      align: "right",
      cell: (row) => {
        const retention = computeOutcomeRates(getCounts(row)).retentionW6;
        return retention === null
          ? NOT_YET_DUE_LABEL
          : rateCell(formatRate(retention));
      },
    },
    {
      key: "response",
      header: "Response (W3)",
      align: "right",
      cell: (row) =>
        rateCell(formatRate(computeOutcomeRates(getCounts(row)).responseRate)),
    },
    {
      key: "median-wage",
      header: "Median wage",
      align: "right",
      cell: (row) => {
        const counts = getCounts(row);
        const wage = suppressMedian(
          counts.medianWageAtPlacement,
          counts.w3InWork,
        );
        return wage === null ? SUPPRESSED_LABEL : formatRupees(wage);
      },
    },
  ];
}
