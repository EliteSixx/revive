"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTable, type Column } from "@/components/ui/table";
import { SUPPRESSED_LABEL } from "@/lib/metrics";
import { formatChartValue } from "./format-chart-value";
import { OutcomeChart } from "./outcome-chart";
import {
  missingReasonKey,
  type ChartDatum,
  type ChartKind,
  type ChartSeries,
  type ValueFormat,
} from "./types";

interface ChartCardProps {
  title: string;
  /** One line saying exactly what is plotted. */
  description: string;
  kind: ChartKind;
  data: readonly ChartDatum[];
  categoryKey: string;
  categoryLabel: string;
  series: readonly ChartSeries[];
  valueFormat: ValueFormat;
  /** Horizontal bars, for long category labels such as reasons. */
  isHorizontal?: boolean;
  height?: number;
}

/** Chart with a "View as table" alternative (design.md sections 6 and 11). */
export function ChartCard({
  title,
  description,
  kind,
  data,
  categoryKey,
  categoryLabel,
  series,
  valueFormat,
  isHorizontal = false,
  height = 280,
}: ChartCardProps) {
  const [isTableView, setIsTableView] = useState(false);
  const hasAnyValue = data.some((row) =>
    series.some((item) => typeof row[item.key] === "number"),
  );

  const columns: Column<ChartDatum>[] = [
    {
      key: categoryKey,
      header: categoryLabel,
      cell: (row) => String(row[categoryKey]),
    },
    ...series.map((item): Column<ChartDatum> => ({
      key: item.key,
      header: item.label,
      align: "right",
      cell: (row) => {
        const value = row[item.key];
        if (typeof value === "number")
          return formatChartValue(value, valueFormat);
        return row[missingReasonKey(item.key)] ?? SUPPRESSED_LABEL;
      },
    })),
  ];

  return (
    <Card>
      <CardHeader
        title={title}
        description={description}
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTableView((current) => !current)}
          >
            {isTableView ? "View as chart" : "View as table"}
          </Button>
        }
      />
      {isTableView ? (
        <DataTable
          caption={title}
          columns={columns}
          rows={data}
          getRowKey={(row) => String(row[categoryKey])}
        />
      ) : !hasAnyValue ? (
        <EmptyState
          title="Not enough data to chart"
          description="Every value here is based on fewer than 10 trainees or is not yet due, so the chart is hidden. The table view shows each value."
        />
      ) : (
        <CardBody>
          <OutcomeChart
            kind={kind}
            data={data}
            categoryKey={categoryKey}
            series={series}
            valueFormat={valueFormat}
            isHorizontal={isHorizontal}
            height={height}
          />
        </CardBody>
      )}
    </Card>
  );
}
