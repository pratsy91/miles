"use client";

import { DirectoryHeader } from "@/components/layout/directory-header";
import { FiltersBar } from "@/components/layout/filters-bar";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { TransactionsMobile } from "@/components/transactions/transactions-mobile";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { DataError, ListSkeleton } from "@/components/ui/data-state";
import { UsersStatCard } from "@/components/users/users-stats";
import { useTransactions } from "@/hooks/use-transactions";
import { downloadTransactionsCsv } from "@/lib/transaction-files";
import type { StoredTransaction } from "@/lib/transactions-store";
import { formatCount, formatMoney } from "@/lib/format";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 8;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function transactionStats(transactions: StoredTransaction[] | null) {
  if (transactions == null) {
    return { total: "—", volume: "—", average: "—", success: "—" };
  }

  const total = transactions.length;
  const volume = transactions.reduce((sum, transaction) => sum + transaction.amountValue, 0);
  const successful = transactions.filter(
    (transaction) => transaction.status === "completed" || transaction.status === "refunded",
  ).length;
  const success = total === 0 ? 0 : (successful / total) * 100;

  return {
    total: formatCount(total),
    volume: formatMoney(volume, 0),
    average: formatMoney(total === 0 ? 0 : volume / total, 2),
    success: `${success.toFixed(1)}%`,
  };
}

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

function TransactionsDirectory() {
  const { transactions, loading, error, reload } = useTransactions();
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [type, setType] = useState("All Types");
  const [amount, setAmount] = useState("All");
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
  const stats = transactionStats(transactions);

  return (
    <main
      data-slot="transactions-page"
      className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20"
    >
      <div className="hidden flex-col gap-6 md:flex">
        <DirectoryHeader
          title="Transaction History"
          subtitle="Monitor and manage all corporate financial transactions"
          actionLabel="Export CSV"
          actionIcon="download"
          actionVariant="ghost"
          onAction={() => downloadTransactionsCsv(filtered)}
        />
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <UsersStatCard label="Total Transactions" value={stats.total} />
          <UsersStatCard label="Total Volume" value={stats.volume} />
          <UsersStatCard label="Avg. Transaction" value={stats.average} />
          <UsersStatCard
            label="Success Rate"
            value={stats.success}
            valueClassName="text-success"
            trailing={<img src="/success.png" alt="" className="h-8 w-auto shrink-0" />}
          />
        </section>
        <FiltersBar
          searchPlaceholder="Search ID or User..."
          search={query}
          onSearchChange={setQuery}
          filters={[
            {
              label: "Date",
              value: dateRange,
              options: ["Last 30 Days", "All Time"],
              onChange: setDateRange,
            },
            {
              label: "Type",
              value: type,
              options: ["All Types", "Payment", "Refund", "Transfer"],
              onChange: setType,
            },
            {
              label: "Amount",
              value: amount,
              options: ["All", "Under $1,000", "$1,000 – $10,000", "Over $10,000"],
              onChange: setAmount,
            },
          ]}
        />
        {loading ? (
          <ListSkeleton rows={8} />
        ) : error ? (
          <DataError message={error} onRetry={reload} />
        ) : (
          <TransactionsTable
            transactions={pageTransactions}
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
        )}
      </div>
      <TransactionsMobile
        transactions={pageTransactions}
        total={filtered.length}
        page={page}
        pageSize={PAGE_SIZE}
        onPrevious={() => setPage((current) => Math.max(0, current - 1))}
        onNext={() =>
          setPage((current) =>
            (current + 1) * PAGE_SIZE >= filtered.length ? current : current + 1,
          )
        }
        stats={stats}
        loading={loading}
        error={error}
        onRetry={reload}
        query={query}
        onQueryChange={setQuery}
        onExport={() => downloadTransactionsCsv(filtered)}
      />
      <MobileTabBar />
    </main>
  );
}

export { TransactionsDirectory };
