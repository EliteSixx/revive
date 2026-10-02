import type { Column } from "@/components/ui/table";
import { formatRupees } from "@/lib/format";
import {
  computeOutcomeRates,
  formatRate,
  formatReportCount,
  isSmallGroup,
  NOT_YET_DUE_LABEL,
  rateValue,
  suppressMedian,
  SUPPRESSED_LABEL,
  type OutcomeRates,
} from "@/lib/metrics";
import type { OutcomeCounts } from "@/types/analytics";

/**
 * Standard outcome columns for comparison tables (providers, districts, courses,
 * cohorts, demographic groups). Every rate uses src/lib/metrics.ts. All columns
 * are sortable; suppressed and not-yet-due values sort last.
 */
export function outcomeColumns<Row>(
  getCounts: (row: Row) => OutcomeCounts,
): Column<Row>[] {
  const rateCell = (value: string | null) => value ?? SUPPRESSED_LABEL;
  const ratesOf = (row: Row): OutcomeRates =>
    computeOutcomeRates(getCounts(row));
  const medianWageOf = (row: Row) => {
    const counts = getCounts(row);
    return suppressMedian(counts.medianWageAtPlacement, counts.w3InWork);
  };

  return [
    {
      key: "certified",
      header: "Certified",
      align: "right",
      cell: (row) => formatReportCount(getCounts(row).certified),
      sortValue: (row) => {
        const { certified } = getCounts(row);
        return isSmallGroup(certified) ? null : certified;
      },
    },
    {
      key: "verified-placement",
      header: "Verified placement (W3)",
      align: "right",
      cell: (row) => rateCell(formatRate(ratesOf(row).verifiedPlacementRate)),
      sortValue: (row) => rateValue(ratesOf(row).verifiedPlacementRate),
    },
    {
      key: "placement",
      header: "Placement (W3)",
      align: "right",
      cell: (row) => rateCell(formatRate(ratesOf(row).placementRate)),
      sortValue: (row) => rateValue(ratesOf(row).placementRate),
    },
    {
      key: "retention-w6",
      header: "Retention (W6)",
      align: "right",
      cell: (row) => {
        const retention = ratesOf(row).retentionW6;
        return retention === null
          ? NOT_YET_DUE_LABEL
          : rateCell(formatRate(retention));
      },
      sortValue: (row) => rateValue(ratesOf(row).retentionW6),
    },
    {
      key: "response",
      header: "Response (W3)",
      align: "right",
      cell: (row) => rateCell(formatRate(ratesOf(row).responseRate)),
      sortValue: (row) => rateValue(ratesOf(row).responseRate),
    },
    {
      key: "median-wage",
      header: "Median wage",
      align: "right",
      cell: (row) => {
        const wage = medianWageOf(row);
        return wage === null ? SUPPRESSED_LABEL : formatRupees(wage);
      },
      sortValue: (row) => medianWageOf(row),
    },
  ];
}
