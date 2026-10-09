import type { FilterDefinition } from "@/components/domain/filter-bar";
import { formatMonth } from "@/lib/format";
import {
  COHORT_MONTHS,
  COURSES,
  DISTRICTS,
  getDistrictName,
  PROGRAMMES,
} from "@/mocks/reference";

/** Standard dashboard filters for government screens (prd.md FR-G-01). */
export const GOV_FILTERS: readonly FilterDefinition[] = [
  {
    id: "programme",
    label: "Programme",
    options: [
      { value: "all", label: "All programmes" },
      ...PROGRAMMES.map((programme) => ({
        value: programme.id,
        label: programme.name,
      })),
    ],
  },
  {
    id: "period",
    label: "Certified between",
    options: [
      {
        value: "all",
        label: `${formatMonth(COHORT_MONTHS[0])} and ${formatMonth(COHORT_MONTHS[COHORT_MONTHS.length - 1])}`,
      },
    ],
  },
  {
    id: "district",
    label: "District",
    options: [
      { value: "all", label: "All districts" },
      ...DISTRICTS.map((district) => ({
        value: district.code,
        label: district.name,
      })),
    ],
  },
  {
    id: "course",
    label: "Course",
    options: [
      { value: "all", label: "All courses" },
      ...COURSES.map((course) => ({ value: course.id, label: course.name })),
    ],
  },
];

/** Returns filters tailored to the role. District officers can only select their own district. */
export function getGovFilters(
  districtCode: string | null,
): readonly FilterDefinition[] {
  const districtOptions = districtCode
    ? [{ value: districtCode, label: getDistrictName(districtCode) }]
    : [
        { value: "all", label: "All districts" },
        ...DISTRICTS.map((district) => ({
          value: district.code,
          label: district.name,
        })),
      ];

  return [
    GOV_FILTERS[0],
    GOV_FILTERS[1],
    {
      id: "district",
      label: "District",
      options: districtOptions,
      defaultValue: districtCode ?? "all",
    },
    GOV_FILTERS[3],
  ];
}
