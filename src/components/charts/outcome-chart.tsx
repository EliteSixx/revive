"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatChartValue } from "./format-chart-value";
import { AXIS_COLORS } from "./palette";
import type { ChartDatum, ChartKind, ChartSeries, ValueFormat } from "./types";

interface OutcomeChartProps {
  kind: ChartKind;
  data: readonly ChartDatum[];
  categoryKey: string;
  series: readonly ChartSeries[];
  valueFormat: ValueFormat;
  isHorizontal: boolean;
  height: number;
}

const TICK_STYLE = { fill: AXIS_COLORS.tickText, fontSize: 12 };
const CHART_MARGIN = { top: 8, right: 16, bottom: 8, left: 8 };

/** Recharts wrapper that enforces the design.md palette, axis style and no animation. */
export function OutcomeChart({
  kind,
  data,
  categoryKey,
  series,
  valueFormat,
  isHorizontal,
  height,
}: OutcomeChartProps) {
  const rows = [...data];
  const formatValue = (value: unknown) =>
    typeof value === "number" ? formatChartValue(value, valueFormat) : "";
  const valueDomain: [number, number] | undefined =
    valueFormat === "percent" ? [0, 1] : undefined;
  const showLegend = series.length > 1;
  // Recharts sorts legend and tooltip items alphabetically by default; keep series order.
  const bySeriesOrder = (item: { dataKey?: unknown }) =>
    series.findIndex((entry) => entry.key === String(item.dataKey));

  const tooltip = (
    <Tooltip
      itemSorter={bySeriesOrder}
      isAnimationActive={false}
      formatter={(value) => formatValue(value)}
      contentStyle={{
        borderRadius: 4,
        borderColor: AXIS_COLORS.grid,
        fontSize: 13,
      }}
    />
  );
  const legend = showLegend ? (
    <Legend itemSorter={bySeriesOrder} wrapperStyle={{ fontSize: 13 }} />
  ) : null;

  if (kind === "line") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={rows} margin={CHART_MARGIN}>
          <CartesianGrid stroke={AXIS_COLORS.grid} vertical={false} />
          <XAxis
            dataKey={categoryKey}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={{ stroke: AXIS_COLORS.axisLine }}
          />
          <YAxis
            tick={TICK_STYLE}
            tickFormatter={formatValue}
            domain={valueDomain}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          {tooltip}
          {legend}
          {series.map((item) => (
            <Line
              key={item.key}
              type="linear"
              dataKey={item.key}
              name={item.label}
              stroke={item.color}
              strokeWidth={2}
              dot={{ r: 3, fill: item.color }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  const isStacked = kind === "stacked-bar";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={rows}
        layout={isHorizontal ? "vertical" : "horizontal"}
        margin={CHART_MARGIN}
      >
        <CartesianGrid
          stroke={AXIS_COLORS.grid}
          horizontal={!isHorizontal}
          vertical={isHorizontal}
        />
        {isHorizontal ? (
          <>
            <XAxis
              type="number"
              tick={TICK_STYLE}
              tickFormatter={formatValue}
              domain={valueDomain}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey={categoryKey}
              tick={TICK_STYLE}
              tickLine={false}
              axisLine={{ stroke: AXIS_COLORS.axisLine }}
              width={190}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={categoryKey}
              tick={TICK_STYLE}
              tickLine={false}
              axisLine={{ stroke: AXIS_COLORS.axisLine }}
            />
            <YAxis
              tick={TICK_STYLE}
              tickFormatter={formatValue}
              domain={valueDomain}
              axisLine={false}
              tickLine={false}
              width={64}
            />
          </>
        )}
        {tooltip}
        {legend}
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            fill={item.color}
            stackId={isStacked ? "stack" : undefined}
            stroke={isStacked ? AXIS_COLORS.segmentGap : undefined}
            strokeWidth={isStacked ? 1 : 0}
            maxBarSize={36}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
