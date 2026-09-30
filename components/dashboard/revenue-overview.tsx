"use client";

import { DataError } from "@/components/ui/data-state";
import { useTransactions } from "@/hooks/use-transactions";
import { netRevenue } from "@/lib/revenue";
import type { StoredTransaction } from "@/lib/transactions-store";
import { cn } from "cn";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const RANGES = ["7D", "1M", "3M", "6M", "1Y"] as const;

const RevenueAreaChart = dynamic(
  () => import("@/components/dashboard/revenue-area-chart").then((mod) => mod.RevenueAreaChart),
  { ssr: false, loading: () => <ChartPlaceholder /> },
);

const RevenueBarChart = dynamic(
  () => import("@/components/dashboard/revenue-bar-chart").then((mod) => mod.RevenueBarChart),
  { ssr: false, loading: () => <ChartPlaceholder /> },
);

type Range = (typeof RANGES)[number];

const EMPTY_TRANSACTIONS: StoredTransaction[] = [];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayBuckets() {
  const today = startOfDay(new Date());
  return Array.from({ length: 7 }, (_, index) => {
    const start = new Date(today);
    start.setDate(today.getDate() - (6 - index));
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    return { label: WEEKDAYS[start.getDay()], start: start.getTime(), end: end.getTime() };
  });
}

function monthWeekBuckets() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const ranges = [
    [1, 7],
    [8, 14],
    [15, 21],
    [22, lastDay],
  ] as const;

  return ranges.map(([from, to], index) => ({
    label: `W${index + 1}`,
    start: new Date(year, month, from).getTime(),
    end: new Date(year, month, to + 1).getTime(),
  }));
}

function monthBuckets(count: number) {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const offset = count - 1 - index;
    const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1);
    return {
      label: start.toLocaleDateString("en-US", { month: "short" }),
      start: start.getTime(),
      end: end.getTime(),
    };
  });
}

function bucketsFor(range: Range) {
  if (range === "7D") {
    return dayBuckets();
  }
  if (range === "1M") {
    return monthWeekBuckets();
  }
  if (range === "3M") {
    return monthBuckets(3);
  }
  if (range === "6M") {
    return monthBuckets(6);
  }
  return monthBuckets(12);
}

function rangeLabel(range: Range, buckets: { start: number; end: number }[]) {
  const first = new Date(buckets[0].start);
  const last = new Date(buckets[buckets.length - 1].end - 1);

  if (range === "1M") {
    return first.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  if (range === "7D") {
    const startText = first.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const endText = last.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${startText} - ${endText}`;
  }

  const startText = first.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const endText = last.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return `${startText} - ${endText}`;
}

function seriesFor(range: Range, transactions: StoredTransaction[]) {
  const buckets = bucketsFor(range);
  return {
    label: rangeLabel(range, buckets),
    data: buckets.map((bucket) => ({
      label: bucket.label,
      revenue:
        Math.round(
          transactions.reduce((sum, transaction) => {
            if (transaction.occurredAt < bucket.start || transaction.occurredAt >= bucket.end) {
              return sum;
            }
            return sum + netRevenue(transaction);
          }, 0) * 100,
        ) / 100,
    })),
  };
}

function niceStep(target: number) {
  if (!Number.isFinite(target) || target <= 0) {
    return 1;
  }

  const magnitude = 10 ** Math.floor(Math.log10(target));
  const normalized = target / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

function chartScale(values: number[]) {
  const max = Math.max(0, ...values);
  const min = Math.min(0, ...values);
  const span = max - min || 1;
  const paddedMax = max === 0 && min === 0 ? 4 : max + span * 0.08;
  const paddedMin = min < 0 ? min - span * 0.08 : 0;
  const step = niceStep((paddedMax - paddedMin) / 4);
  const top = Math.ceil(paddedMax / step) * step;
  const bottom = min < 0 ? Math.floor(paddedMin / step) * step : 0;
  const ticks: number[] = [];

  for (let value = bottom; value <= top + step * 0.001; value += step) {
    ticks.push(Number(value.toFixed(6)));
  }

  return { domain: [bottom, top] as [number, number], ticks };
}

function ChartPlaceholder() {
  return <div aria-busy="true" className="min-h-0 w-full flex-1 animate-pulse rounded-lg bg-slate-100" />;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

function RevenueOverview() {
  const [range, setRange] = useState<Range>("6M");
  const { transactions, error, reload } = useTransactions();
  const isMobile = useIsMobile();
  const list = transactions ?? EMPTY_TRANSACTIONS;
  const series = useMemo(() => seriesFor(range, list), [range, list]);
  const mobileSeries = useMemo(() => seriesFor("6M", list), [list]);
  const scale = chartScale(series.data.map((point) => point.revenue));
  const chartStatus = error ? (
    <DataError message={error} onRetry={reload} />
  ) : transactions == null ? (
    <ChartPlaceholder />
  ) : null;

  if (isMobile == null) {
    return (
      <div
        aria-busy="true"
        className="box-border h-75.75 animate-pulse rounded-lg border border-solid border-slate-200 bg-slate-100 max-md:h-44"
      />
    );
  }

  const chart =
    chartStatus ??
    (isMobile ? (
      <RevenueBarChart data={mobileSeries.data} />
    ) : (
      <RevenueAreaChart data={series.data} domain={scale.domain} ticks={scale.ticks} />
    ));

  if (!isMobile) {
    return (
    <article className="box-border flex h-75.75 min-w-0 w-full flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
            Revenue Overview
          </h3>
          <p className="text-[12px] font-normal leading-none tracking-normal text-slate-500">
            {series.label}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {RANGES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={cn(
                "h-6 rounded-md px-2 text-[12px] font-medium leading-none tracking-normal",
                item === range
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {chart}
    </article>
    );
  }

  return (
    <article className="box-border flex h-44 min-w-0 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
            Revenue Overview
          </h3>
          <p className="text-[12px] font-normal leading-none tracking-normal text-slate-500">
            {mobileSeries.label}
          </p>
        </div>
        <span className="text-[12px] font-medium leading-none tracking-normal text-slate-500">
          6M
        </span>
      </div>
      {chart}
    </article>
  );
}

export { RevenueOverview };
