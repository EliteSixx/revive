import { ChartCard } from "@/components/charts/chart-card";
import { toRateChartData } from "@/components/charts/chart-data";
import { CHART_COLORS } from "@/components/charts/palette";
import { FilterBar } from "@/components/domain/filter-bar";
import { PageHeader } from "@/components/layout/page-header";
import { BreakdownTable } from "@/features/gov/breakdown-table";
import { GOV_FILTERS } from "@/features/gov/gov-filters";
import {
  GENDER_LABELS,
  RESIDENCE_TYPE_LABELS,
  SOCIAL_CATEGORY_LABELS,
} from "@/lib/constants";
import { DEMOGRAPHIC_BREAKDOWNS } from "@/mocks/analytics";
import { AGE_BANDS } from "@/mocks/reference";

export const metadata = { title: "Demographics" };

const AGE_LABELS = Object.fromEntries(AGE_BANDS.map((band) => [band, band]));
const DISABILITY_LABELS = {
  YES: "Persons with disability",
  NO: "Without disability",
};

export default function GovDemographicsPage() {
  const socialCategoryGroups = DEMOGRAPHIC_BREAKDOWNS.socialCategory.map(
    (group) => ({
      label:
        SOCIAL_CATEGORY_LABELS[
          group.key as keyof typeof SOCIAL_CATEGORY_LABELS
        ],
      counts: group.counts,
    }),
  );

  return (
    <>
      <PageHeader
        title="Demographics"
        description="Outcomes by trainee group, to check that every group benefits. Groups with fewer than 10 trainees are hidden."
      />
      <FilterBar filters={GOV_FILTERS} />

      <div className="mb-6">
        <ChartCard
          title="Placement by social category"
          description="Placement at W3, all sources and verified only."
          kind="bar"
          data={toRateChartData(socialCategoryGroups, [
            "placementRate",
            "verifiedPlacementRate",
          ])}
          categoryKey="label"
          categoryLabel="Social category"
          series={[
            {
              key: "placementRate",
              label: "All sources",
              color: CHART_COLORS[0],
            },
            {
              key: "verifiedPlacementRate",
              label: "Verified only",
              color: CHART_COLORS[2],
            },
          ]}
          valueFormat="percent"
        />
      </div>

      <div className="flex flex-col gap-6">
        <BreakdownTable
          title="By gender"
          groupHeader="Gender"
          groups={DEMOGRAPHIC_BREAKDOWNS.gender}
          labels={GENDER_LABELS}
        />
        <BreakdownTable
          title="By age"
          groupHeader="Age"
          groups={DEMOGRAPHIC_BREAKDOWNS.ageBand}
          labels={AGE_LABELS}
        />
        <BreakdownTable
          title="By social category"
          groupHeader="Social category"
          groups={DEMOGRAPHIC_BREAKDOWNS.socialCategory}
          labels={SOCIAL_CATEGORY_LABELS}
        />
        <BreakdownTable
          title="By disability"
          groupHeader="Group"
          groups={DEMOGRAPHIC_BREAKDOWNS.disability}
          labels={DISABILITY_LABELS}
        />
        <BreakdownTable
          title="By residence"
          groupHeader="Residence"
          groups={DEMOGRAPHIC_BREAKDOWNS.residence}
          labels={RESIDENCE_TYPE_LABELS}
        />
      </div>
    </>
  );
}
