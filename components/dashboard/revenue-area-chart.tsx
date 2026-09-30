"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#4F46E5",
  },
} satisfies ChartConfig;

type RevenuePoint = {
  label: string;
  revenue: number;
};

function formatTick(value: number) {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1000) {
    const thousands = abs / 1000;
    const digits = thousands >= 10 ? 0 : 1;
    const text = thousands.toFixed(digits).replace(/\.0$/, "");
    return `${sign}$${text}K`;
  }

  const text = Number.isInteger(abs) ? String(abs) : abs.toFixed(1).replace(/\.0$/, "");
  return `${sign}$${text}`;
}

function formatTooltip(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function RevenueAreaChart({
  data,
  domain,
  ticks,
}: {
  data: RevenuePoint[];
  domain: [number, number];
  ticks: number[];
}) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto min-h-0 w-full flex-1">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenue-overview-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#E2E8F0" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: "#94A3B8", fontSize: 12 }}
        />
        <YAxis
          domain={domain}
          ticks={ticks}
          tickFormatter={formatTick}
          tickLine={false}
          axisLine={false}
          width={48}
          tick={{ fill: "#94A3B8", fontSize: 12 }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="border-slate-200 bg-white text-slate-900"
              formatter={(value) => formatTooltip(Number(value))}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          fill="url(#revenue-overview-fill)"
          dot={{ r: 3.5, fill: "#4F46E5", stroke: "#4F46E5", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#4F46E5", stroke: "#ffffff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export { RevenueAreaChart };
