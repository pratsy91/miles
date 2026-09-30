"use client";

import { Button } from "@/components/ui/button";

const PAGE_BUTTON =
  "h-6.75 rounded-md border border-slate-200 bg-white text-[12px] font-semibold leading-none tracking-normal text-slate-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300 disabled:opacity-100";

function ListSkeleton({
  rows = 6,
  variant = "rows",
}: {
  rows?: number;
  variant?: "rows" | "cards" | "plain";
}) {
  const bars = Array.from({ length: rows }, (_, index) => (
    <div key={index} className="h-10 animate-pulse rounded-md bg-slate-100" />
  ));

  if (variant === "cards") {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="box-border flex h-25.75 animate-pulse flex-col justify-between rounded-lg border border-solid border-slate-200 bg-white p-3"
          >
            <div className="h-9 w-2/3 rounded bg-slate-100" />
            <div className="h-4 w-1/2 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "plain") {
    return (
      <div className="flex flex-col gap-3 py-3" aria-busy="true" aria-live="polite">
        {bars}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-5"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-10 animate-pulse rounded-md bg-slate-100" />
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <div className="h-30 animate-pulse rounded-lg border border-solid border-slate-200 bg-slate-100" />
      <div className="h-40 animate-pulse rounded-lg border border-solid border-slate-200 bg-white" />
      <div className="h-24 animate-pulse rounded-lg border border-solid border-slate-200 bg-white" />
    </div>
  );
}

function DataError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-lg border border-solid border-slate-200 bg-white p-5"
    >
      <p className="text-[14px] font-semibold leading-none tracking-normal text-slate-900">
        Something went wrong
      </p>
      <p className="text-[13px] font-normal leading-none tracking-normal text-error">{message}</p>
      {onRetry ? (
        <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

function DataEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-start gap-2 px-3 py-8">
      <p className="text-[14px] font-semibold leading-none tracking-normal text-slate-900">{title}</p>
      <p className="text-[13px] font-normal leading-none tracking-normal text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ListPagination({
  page,
  pageSize,
  total,
  onPrevious,
  onNext,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const start = total === 0 ? 0 : page * pageSize + 1;
  const end = Math.min(total, (page + 1) * pageSize);

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3 pt-3 min-[1200px]:h-9.75 min-[1200px]:flex-nowrap min-[1200px]:gap-0">
      <p className="text-[13px] font-normal leading-none tracking-normal text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-900">
          {start}-{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-900">{total.toLocaleString("en-US")}</span> results
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={page === 0 || total === 0}
          onClick={onPrevious}
          className={`${PAGE_BUTTON} w-18.75`}
        >
          Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={end >= total}
          onClick={onNext}
          className={`${PAGE_BUTTON} w-13`}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export { DataEmpty, DataError, DetailSkeleton, ListPagination, ListSkeleton };
