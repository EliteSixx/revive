import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { EmptyState } from "./empty-state";

export interface Column<Row> {
  key: string;
  header: string;
  align?: "left" | "right";
  /** Renders the cell. Numbers should be formatted with src/lib/format.ts. */
  cell: (row: Row) => ReactNode;
  /** Let long text wrap. Other cells stay on one line and the table scrolls sideways. */
  wrap?: boolean;
}

interface DataTableProps<Row> {
  caption: string;
  columns: readonly Column<Row>[];
  rows: readonly Row[];
  getRowKey: (row: Row) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Total number of records, when only part of the list is shown. */
  totalCount?: number;
  className?: string;
}

/**
 * Static data table (design.md section 6). Sorting and pagination are added in
 * Phase 3 when tables are backed by real queries.
 */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowKey,
  emptyTitle = "Nothing to show",
  emptyDescription = "There are no records for the selected filters.",
  totalCount,
  className,
}: DataTableProps<Row>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-muted">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "border-b border-border px-4 py-2.5 text-label whitespace-nowrap text-fg-muted",
                  column.align === "right" && "text-right",
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className="border-b border-border last:border-b-0"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "h-11 px-4 py-2 align-middle",
                    column.wrap
                      ? "min-w-60 whitespace-normal"
                      : "whitespace-nowrap",
                    column.align === "right" && "text-right tabular-nums",
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalCount !== undefined && (
        <p className="border-t border-border px-4 py-2.5 text-small text-fg-muted">
          Showing {formatNumber(rows.length)} of {formatNumber(totalCount)}
        </p>
      )}
    </div>
  );
}
