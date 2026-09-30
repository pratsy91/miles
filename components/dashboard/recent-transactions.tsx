"use client";

import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataEmpty, DataError, ListPagination, ListSkeleton } from "@/components/ui/data-state";
import { useTransactions } from "@/hooks/use-transactions";
import type { StoredTransaction } from "@/lib/transactions-store";
import { ChevronDown, Eye, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const HEADER_CELL =
  "text-[12px] font-semibold leading-none tracking-normal text-slate-500 uppercase";

const PAGE_SIZE = 4;
const MOBILE_COUNT = 3;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const DATE_OPTIONS = ["Last 30 Days", "All Time"] as const;
const TYPE_OPTIONS = ["All Types", "Payment", "Refund", "Transfer"] as const;
const AMOUNT_OPTIONS = ["All", "Under $1,000", "$1,000 – $10,000", "Over $10,000"] as const;

function matchesQuery(transaction: StoredTransaction, query: string) {
  const value = query.trim().toLowerCase();
  if (!value) {
    return true;
  }

  return (
    transaction.id.toLowerCase().includes(value) ||
    transaction.name.toLowerCase().includes(value)
  );
}

function matchesAmount(transaction: StoredTransaction, amount: string) {
  const value = transaction.amountValue;
  if (amount === "Under $1,000") {
    return value < 1000;
  }
  if (amount === "$1,000 – $10,000") {
    return value >= 1000 && value <= 10000;
  }
  if (amount === "Over $10,000") {
    return value > 10000;
  }
  return true;
}

function formatDashboardDate(occurredAt: number) {
  return new Date(occurredAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RecentTransactions() {
  const { transactions, loading, error, reload } = useTransactions();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<(typeof DATE_OPTIONS)[number]>("Last 30 Days");
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]>("All Types");
  const [amount, setAmount] = useState<(typeof AMOUNT_OPTIONS)[number]>("All");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const now = Date.now();
    const next = (transactions ?? []).filter((transaction) => {
      const matchesDate =
        dateRange === "All Time" || now - transaction.occurredAt <= THIRTY_DAYS;
      const matchesType = type === "All Types" || transaction.type === type.toLowerCase();
      return (
        matchesQuery(transaction, query) &&
        matchesDate &&
        matchesType &&
        matchesAmount(transaction, amount)
      );
    });

    next.sort((left, right) => right.occurredAt - left.occurredAt);
    return next;
  }, [transactions, query, dateRange, type, amount]);

  useEffect(() => {
    setPage(0);
  }, [query, dateRange, type, amount]);

  const pageTransactions = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const mobileTransactions = filtered.slice(0, MOBILE_COUNT);

  return (
    <>
      <article className="box-border hidden min-h-96.75 min-w-0 flex-col rounded-lg border border-solid border-slate-200 bg-white p-5 md:flex">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
            Recent Transactions
          </h3>
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
            className="h-8 gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium leading-none tracking-normal text-slate-600"
          >
            <Filter aria-hidden className="size-4" />
            Filter
          </Button>
        </div>

        {filtersOpen ? (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="flex h-8 min-w-45 flex-1 items-center gap-2 rounded-lg border border-solid border-slate-200 bg-white px-3">
              <Search aria-hidden className="size-4 shrink-0 text-slate-400" />
              <input
                type="text"
                inputMode="search"
                enterKeyHint="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search ID or User..."
                className="min-w-0 flex-1 bg-transparent text-[13px] font-normal leading-none tracking-normal text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
            <FilterChoice
              label="Date"
              value={dateRange}
              options={DATE_OPTIONS}
              onChange={setDateRange}
            />
            <FilterChoice
              label="Type"
              value={type}
              options={TYPE_OPTIONS}
              onChange={setType}
            />
            <FilterChoice
              label="Amount"
              value={amount}
              options={AMOUNT_OPTIONS}
              onChange={setAmount}
            />
          </div>
        ) : null}

        <div className="w-full overflow-x-auto">
          <div className="w-full">
            <div
              role="row"
              className="dashboard-transactions-grid grid min-h-10 items-center gap-4 rounded-md bg-slate-50 px-3"
            >
              <span role="columnheader" className={HEADER_CELL}>
                Transaction ID
              </span>
              <span role="columnheader" className={HEADER_CELL}>
                User
              </span>
              <span role="columnheader" className={HEADER_CELL}>
                Amount
              </span>
              <span role="columnheader" className={HEADER_CELL}>
                Status
              </span>
              <span role="columnheader" className={HEADER_CELL}>
                Date
              </span>
              <span role="columnheader" className={HEADER_CELL}>
                Action
              </span>
            </div>
            {loading ? (
              <ListSkeleton variant="plain" rows={4} />
            ) : error ? (
              <DataError message={error} onRetry={reload} />
            ) : pageTransactions.length === 0 ? (
              <DataEmpty
                title="No transactions"
                description="No transactions match these filters."
              />
            ) : (
              pageTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  role="row"
                  className="dashboard-transactions-grid grid h-14 items-center gap-4 border-b border-slate-200 px-3"
                >
                  <span className="text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                    {transaction.id}
                  </span>
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar size="sm" src={transaction.image} alt={transaction.name}>
                      {transaction.initials}
                    </Avatar>
                    <p className="truncate text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                      {transaction.name}
                    </p>
                  </div>
                  <span
                    className={`text-[13px] font-semibold leading-none tracking-normal ${transaction.negative ? "text-error" : "text-slate-900"}`}
                  >
                    {transaction.amount}
                  </span>
                  <StatusBadge status={transaction.status} />
                  <span className="text-[13px] font-normal leading-none tracking-normal text-slate-600">
                    {formatDashboardDate(transaction.occurredAt)}
                  </span>
                  <Link
                    href={`/transactions/${transaction.id.slice(1)}`}
                    aria-label={`View ${transaction.id}`}
                    className="text-slate-600"
                  >
                    <Eye aria-hidden className="size-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {!loading && !error ? (
          <ListPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPrevious={() => setPage((current) => Math.max(0, current - 1))}
            onNext={() =>
              setPage((current) =>
                (current + 1) * PAGE_SIZE >= filtered.length ? current : current + 1,
              )
            }
          />
        ) : null}
      </article>
      <div className="flex flex-col gap-2.5 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
            Recent Transactions
          </h3>
          <Link
            href="/transactions"
            className="font-sans text-[12px] font-semibold leading-none tracking-normal text-indigo-600"
          >
            View All
          </Link>
        </div>
        {loading ? (
          <ListSkeleton variant="cards" rows={3} />
        ) : error ? (
          <DataError message={error} onRetry={reload} />
        ) : mobileTransactions.length === 0 ? (
          <DataEmpty
            title="No transactions"
            description="No transactions match these filters."
          />
        ) : (
          mobileTransactions.map((transaction) => (
            <article
              key={transaction.id}
              className="relative box-border flex min-h-15.75 w-full items-center justify-between rounded-lg border border-solid border-slate-200 bg-white p-3"
            >
              <Link
                href={`/transactions/${transaction.id.slice(1)}`}
                aria-label={`View ${transaction.id}`}
                className="absolute inset-0 rounded-lg"
              />
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar
                  size="sm"
                  src={transaction.image}
                  alt={transaction.name}
                  className="size-8 rounded-2xl"
                >
                  {transaction.initials}
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-sans text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                    {transaction.name}
                  </p>
                  <p className="mt-0.5 truncate font-sans text-[11px] font-normal leading-none tracking-normal text-slate-500">
                    {transaction.id}
                    <span aria-hidden className="px-1">
                      •
                    </span>
                    {formatDashboardDate(transaction.occurredAt)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className={`font-sans text-[13px] font-bold leading-none tracking-normal ${transaction.negative ? "text-error" : "text-slate-900"}`}
                >
                  {transaction.amount}
                </span>
                <StatusBadge status={transaction.status} />
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}

function FilterChoice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="relative inline-flex h-8 shrink-0">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-8 appearance-none rounded-lg border border-solid border-slate-200 bg-white py-2 pr-8 pl-3 text-[13px] font-medium leading-none tracking-normal text-slate-700 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {label} {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-500"
      />
    </label>
  );
}

export { RecentTransactions };
