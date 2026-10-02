import { Fragment, type ReactNode } from "react";
import {
  DataTableView,
  type ColumnMeta,
  type PreparedRow,
  type SortValue,
} from "./data-table-view";
import { EmptyState } from "./empty-state";

export type { SortValue };

export interface Column<Row> {
  key: string;
  header: string;
  align?: "left" | "right";
  /** Renders the cell. Numbers should be formatted with src/lib/format.ts. */
  cell: (row: Row) => ReactNode;
  /**
   * Makes the column sortable. Return a number or string to sort by, or null for
   * values that should always sort last (for example suppressed figures).
   */
  sortValue?: (row: Row) => SortValue;
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
  /** Rows per page. Leave out to show every row. */
  pageSize?: number;
  /** Total number of records, when `rows` holds only part of them. */
  totalCount?: number;
  className?: string;
}

/**
 * Data table (design.md section 6). Works in server and client components:
 * cells are rendered here, then the interactive view sorts and pages them.
 */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowKey,
  emptyTitle = "Nothing to show",
  emptyDescription = "There are no records for the selected filters.",
  pageSize,
  totalCount,
  className,
}: DataTableProps<Row>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const columnMeta: ColumnMeta[] = columns.map((column) => ({
    key: column.key,
    header: column.header,
    align: column.align ?? "left",
    wrap: column.wrap ?? false,
    isSortable: column.sortValue !== undefined,
  }));

  const preparedRows: PreparedRow[] = rows.map((row) => ({
    key: getRowKey(row),
    // Keyed fragments: the cells travel to the client view as an array of elements.
    cells: columns.map((column) => (
      <Fragment key={column.key}>{column.cell(row)}</Fragment>
    )),
    sortValues: columns.map((column) => column.sortValue?.(row) ?? null),
  }));

  return (
    <DataTableView
      caption={caption}
      columns={columnMeta}
      rows={preparedRows}
      pageSize={pageSize}
      totalCount={totalCount}
      className={className}
    />
  );
}
