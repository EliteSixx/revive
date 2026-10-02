import { Select, type SelectOption } from "@/components/ui/select";

export interface FilterDefinition {
  id: string;
  label: string;
  options: readonly SelectOption[];
  defaultValue?: string;
}

/**
 * Row of filters above dashboards (design.md section 6).
 * Phase 1: filters are visual only. Phase 3 connects them to the URL and the queries.
 */
export function FilterBar({
  filters,
}: {
  filters: readonly FilterDefinition[];
}) {
  return (
    <div
      role="group"
      aria-label="Filters"
      className="mb-6 grid gap-3 rounded-md border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {filters.map((filter) => (
        <div key={filter.id} className="flex flex-col gap-1.5">
          <label htmlFor={`filter-${filter.id}`} className="text-label">
            {filter.label}
          </label>
          <Select
            id={`filter-${filter.id}`}
            options={filter.options}
            defaultValue={filter.defaultValue}
          />
        </div>
      ))}
    </div>
  );
}
