"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

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

function formatTooltip(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function RevenueBarChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto min-h-0 w-full flex-1">
      <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
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
        <Bar dataKey="revenue" fill="#6366F1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

export { RevenueBarChart };
