import { formatNumber, formatPercent, formatRupees } from "@/lib/format";
import {
  computeOutcomeRates,
  formatBase,
  formatRate,
  isSmallGroup,
  NOT_YET_DUE_LABEL,
  suppressMedian,
} from "@/lib/metrics";
import type { OutcomeCounts } from "@/types/analytics";
import { MetricTile } from "./metric-tile";

/** The six headline tiles used on overview, provider and district pages. */
export function OutcomeSummaryTiles({ counts }: { counts: OutcomeCounts }) {
  const rates = computeOutcomeRates(counts);
  const medianWage = suppressMedian(
    counts.medianWageAtPlacement,
    counts.w3InWork,
  );
  const verifiedShare = formatRate(rates.verifiedShare, 0);
  const wageProgression = suppressMedian(
    counts.medianWageProgression,
    counts.w12Eligible,
  );

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <MetricTile
        label="Verified placement rate (W3)"
        value={formatRate(rates.verifiedPlacementRate)}
        baseText={formatBase(counts.w3Closed, "with W3 closed")}
        detailText="Employer confirmed or EPFO verified only"
      />
      <MetricTile
        label="Placement rate (W3), all sources"
        value={formatRate(rates.placementRate)}
        baseText={formatBase(counts.w3Closed, "with W3 closed")}
        detailText={
          verifiedShare ? `${verifiedShare} of placements verified` : undefined
        }
      />
      <MetricTile
        label="Retention at W6"
        value={formatRate(rates.retentionW6)}
        baseText={formatBase(counts.w6Eligible, "in work at W3")}
        missingText={rates.retentionW6 === null ? NOT_YET_DUE_LABEL : undefined}
      />
      <MetricTile
        label="Median wage at placement"
        value={medianWage === null ? null : formatRupees(medianWage)}
        baseText="Monthly gross, wage employment only"
      />
      <MetricTile
        label="Response rate (W3)"
        value={formatRate(rates.responseRate)}
        baseText={formatBase(counts.w3Closed, "with W3 closed")}
      />
      <MetricTile
        label="Certified"
        value={
          isSmallGroup(counts.certified) ? null : formatNumber(counts.certified)
        }
        baseText="Trainees in the selected period"
        detailText={
          wageProgression === null
            ? undefined
            : `Median wage change by W12: ${formatPercent(wageProgression)}`
        }
      />
    </div>
  );
}
