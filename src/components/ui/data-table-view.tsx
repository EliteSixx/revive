"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { Button } from "./button";

export type SortValue = string | number | null;

export interface ColumnMeta {
  key: string;
  header: string;
  align: "left" | "right";
  wrap: boolean;
  isSortable: boolean;
}

export interface PreparedRow {
  key: string;
  cells: ReactNode[];
  sortValues: SortValue[];
}

type SortDirection = "ascending" | "descending";

interface SortState {
  columnIndex: number;
  direction: SortDirection;
}

interface DataTableViewProps {
  caption: string;
  columns: readonly ColumnMeta[];
  rows: readonly PreparedRow[];
  pageSize?: number;
  totalCount?: number;
  className?: string;
}

/** Null values sort last in both directions, so suppressed figures never lead a ranking. */
function compareSortValues(
  a: SortValue,
  b: SortValue,
  direction: SortDirection,
): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  const order =
    typeof a === "number" && typeof b === "number"
      ? a - b
      : String(a).localeCompare(String(b), "en");
  return direction === "ascending" ? order : -order;
}

/** Interactive part of DataTable. Use DataTable, not this component, in pages. */
export function DataTableView({
  caption,
  columns,
  rows,
  pageSize,
  totalCount,
  className,
}: DataTableViewProps) {
  const [sort, setSort] = useState<SortState | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const sortedRows = sort
    ? [...rows].sort((a, b) =>
        compareSortValues(
          a.sortValues[sort.columnIndex],
          b.sortValues[sort.columnIndex],
          sort.direction,
        ),
      )
    : rows;

  const pageCount = pageSize
    ? Math.max(1, Math.ceil(sortedRows.length / pageSize))
    : 1;
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const firstRowIndex = pageSize ? currentPage * pageSize : 0;
  const visibleRows = pageSize
    ? sortedRows.slice(firstRowIndex, firstRowIndex + pageSize)
    : sortedRows;

  function toggleSort(columnIndex: number) {
    setSort((current) =>
      current?.columnIndex === columnIndex && current.direction === "ascending"
        ? { columnIndex, direction: "descending" }
        : { columnIndex, direction: "ascending" },
    );
    setPageIndex(0);
  }

  const recordCount = totalCount ?? rows.length;
  const showFooter = pageCount > 1 || totalCount !== undefined;

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          {caption}
          {columns.some((column) => column.isSortable) &&
            ". Column headers with buttons can be sorted."}
        </caption>
        <thead className="bg-surface-muted">
          <tr>
            {columns.map((column, columnIndex) => {
              const direction =
                sort?.columnIndex === columnIndex ? sort.direction : undefined;
              const SortIcon =
                direction === "ascending"
                  ? ArrowUp
                  : direction === "descending"
                    ? ArrowDown
                    : ArrowUpDown;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    column.isSortable ? (direction ?? "none") : undefined
                  }
                  className={cn(
                    "border-b border-border px-4 py-2.5 text-label whitespace-nowrap text-fg-muted",
                    column.align === "right" && "text-right",
                  )}
                >
                  {column.isSortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(columnIndex)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-sm hover:text-fg",
                        column.align === "right" && "flex-row-reverse",
                        direction && "text-fg",
                      )}
                    >
                      {column.header}
                      <SortIcon
                        className="size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr
              key={row.key}
              className="border-b border-border last:border-b-0"
            >
              {row.cells.map((cell, columnIndex) => {
                const column = columns[columnIndex];
                return (
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
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {showFooter && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-2.5">
          <p className="text-small text-fg-muted">
            Showing{" "}
            {formatNumber(visibleRows.length === 0 ? 0 : firstRowIndex + 1)} to{" "}
            {formatNumber(firstRowIndex + visibleRows.length)} of{" "}
            {formatNumber(recordCount)}
          </p>
          {pageCount > 1 && (
            <nav
              aria-label={`${caption} pages`}
              className="flex items-center gap-2"
            >
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => setPageIndex(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-small text-fg-muted">
                Page {formatNumber(currentPage + 1)} of{" "}
                {formatNumber(pageCount)}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === pageCount - 1}
                onClick={() => setPageIndex(currentPage + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
