import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { DataEmpty, DataError, ListPagination, ListSkeleton } from "@/components/ui/data-state";
import type { StoredTransaction } from "@/lib/transactions-store";
import { Download, Eye, Filter, Search } from "lucide-react";
import Link from "next/link";

const TYPE_LABELS = {
  payment: "Payment",
  refund: "Refund",
  transfer: "Transfer",
} as const;

const TYPE_STATUS = {
  payment: "info",
  refund: "failed",
  transfer: "info",
} as const;

function TransactionsMobile({
  transactions,
  total,
  page,
  pageSize,
  onPrevious,
  onNext,
  stats,
  loading,
  error,
  onRetry,
  query,
  onQueryChange,
  onExport,
}: {
  transactions: StoredTransaction[];
  total: number;
  page: number;
  pageSize: number;
  onPrevious: () => void;
  onNext: () => void;
  stats: { total: string; volume: string; average: string; success: string };
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  onExport: () => void;
}) {
  const mobileStats = [
    { label: "Total Txns", value: stats.total },
    { label: "Total Volume", value: stats.volume },
    { label: "Avg. Amount", value: stats.average },
    { label: "Success Rate", value: stats.success, valueClassName: "text-success" },
  ];
  return (
    <div className="flex flex-col gap-4 md:hidden">
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-[18px] font-bold leading-none tracking-normal text-slate-900">
          Transactions Ledger
        </h2>
        <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
          Monitor corporate financial ledger
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label className="box-border flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-solid border-slate-200 bg-white px-3 py-2">
          <Search aria-hidden className="size-4 shrink-0 text-slate-400" />
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search Transaction..."
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-none tracking-normal text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
        <button
          type="button"
          aria-label="Filter transactions"
          className="box-border flex size-9 shrink-0 items-center justify-center rounded-lg border border-solid border-slate-200 bg-white text-slate-600"
        >
          <Filter aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Export transactions"
          onClick={onExport}
          className="box-border flex size-9 shrink-0 items-center justify-center rounded-lg border border-solid border-slate-200 bg-white text-slate-600"
        >
          <Download aria-hidden className="size-4" />
        </button>
      </div>

      <section className="grid grid-cols-2 gap-2">
        {mobileStats.map((stat) => (
          <article
            key={stat.label}
            className="box-border flex h-15 min-w-0 flex-col gap-1 rounded-lg border border-solid border-slate-200 bg-white p-3"
          >
            <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
              {stat.label}
            </p>
            <p
              className={`font-sans text-[16px] font-bold leading-none tracking-normal text-slate-900 ${"valueClassName" in stat ? stat.valueClassName : ""}`}
            >
              {stat.value}
            </p>
          </article>
        ))}
      </section>

      <div className="flex flex-col gap-3">
        {loading ? <ListSkeleton variant="cards" rows={4} /> : null}
        {error ? <DataError message={error} onRetry={onRetry} /> : null}
        {!loading && !error && total === 0 ? (
          <DataEmpty title="No transactions" description="No transactions match these filters." />
        ) : null}
        {!loading && !error
          ? transactions.map((transaction) => (
          <article
            key={transaction.id}
            className="relative box-border flex h-auto w-full flex-col rounded-lg border border-solid border-slate-200 bg-white p-3"
          >
            <Link
              href={`/transactions/${transaction.id.slice(1)}`}
              aria-label={`View ${transaction.id}`}
              className="absolute inset-0 rounded-lg"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-[13px] font-bold leading-none tracking-normal text-slate-900">
                {transaction.id}
              </span>
              <StatusBadge status={transaction.status} />
            </div>
            <div className="mt-2.5 h-0 w-full border-t border-solid border-slate-200" />
            <div className="mt-2.5 flex items-center">
              <Avatar
                size="sm"
                src={transaction.image}
                alt={transaction.name}
                className="size-6 rounded-xl text-[10px]"
              >
                {transaction.initials}
              </Avatar>
              <p className="ml-2 min-w-0 flex-1 truncate font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
                {transaction.name}
              </p>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span
                  className={`font-sans text-[13px] font-bold leading-none tracking-normal ${transaction.negative ? "text-error" : "text-slate-900"}`}
                >
                  {transaction.amount}
                </span>
                <StatusBadge status={TYPE_STATUS[transaction.type]}>
                  {TYPE_LABELS[transaction.type]}
                </StatusBadge>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <p className="font-sans text-[10px] font-normal leading-none tracking-normal text-slate-500">
                {transaction.dateTime}
              </p>
              <Link
                href={`/transactions/${transaction.id.slice(1)}`}
                aria-label={`View ${transaction.id}`}
                className="relative z-10 flex size-6 items-center justify-center text-slate-600"
              >
                <Eye aria-hidden className="size-4" />
              </Link>
            </div>
          </article>
        ))
          : null}
        {!loading && !error && total > 0 ? (
          <ListPagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        ) : null}
      </div>
    </div>
  );
}

export { TransactionsMobile };
