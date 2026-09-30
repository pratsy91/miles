"use client";

import { TransactionDetailMobile } from "@/components/transactions/transaction-detail-mobile";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { InfoRows } from "@/components/users/user-detail-columns";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataEmpty, DataError, DetailSkeleton } from "@/components/ui/data-state";
import { useAlerts } from "@/components/ui/alerts";
import { useTransactions } from "@/hooks/use-transactions";
import { printTransaction } from "@/lib/transaction-files";
import { refundTransaction, type StoredTransaction } from "@/lib/transactions-store";
import { ArrowLeftRight, Check, Printer } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const TYPE_LABELS = {
  payment: "Payment",
  refund: "Refund",
  transfer: "Transfer",
} as const;

const LEDGER_ENTRIES = [
  {
    id: "#TXN-7102",
    method: "Visa Card (*4582)",
    amount: "$120.00",
    settledAt: "Aug 15, 2024 10:14",
  },
  {
    id: "#TXN-5921",
    method: "Direct PayPal Link",
    amount: "$350.00",
    settledAt: "Jul 02, 2024 16:50",
  },
] as const;

const LEDGER_HEADER =
  "whitespace-nowrap text-[12px] font-semibold leading-none tracking-normal text-slate-500 uppercase";

function findTransaction(transactions: StoredTransaction[], id: string) {
  const decoded = decodeURIComponent(id);
  const normalized = decoded.startsWith("#") ? decoded : `#${decoded}`;
  return transactions.find((item) => item.id === normalized) ?? null;
}

function historyTime(occurredAt: number, minutesEarlier: number) {
  return new Date(occurredAt - minutesEarlier * 60 * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function TransactionDetailScreen({ id }: { id: string }) {
  const { transactions, loading, error, reload } = useTransactions();
  const notify = useAlerts();
  const transaction = transactions ? findTransaction(transactions, id) : null;

  useEffect(() => {
    if (!transaction) {
      return;
    }

    const current = transaction;
    function onPrint() {
      printTransaction(current);
    }

    window.addEventListener("miles-print-transaction", onPrint);
    return () => window.removeEventListener("miles-print-transaction", onPrint);
  }, [transaction]);

  if (loading) {
    return (
      <main data-mobile-outline="" className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20">
        <DetailSkeleton />
        <MobileTabBar />
      </main>
    );
  }

  if (error || !transaction) {
    return (
      <main data-mobile-outline="" className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20">
        {error ? (
          <DataError message={error} onRetry={reload} />
        ) : (
          <DataEmpty
            title="Transaction not found"
            description="This transaction is not in the ledger."
          />
        )}
        <MobileTabBar />
      </main>
    );
  }

  const history = [
    {
      title: transaction.status === "refunded" ? "Refunded" : "Completed & Disbursed",
      detail:
        transaction.status === "refunded"
          ? "Amount returned to the customer"
          : "Settled in merchant bank account",
      time: historyTime(transaction.occurredAt, 0),
      tone: transaction.status === "failed" ? "indigo" : "success",
    },
    {
      title: "Processing & Authorized",
      detail: "Visa Gateway auth approved",
      time: historyTime(transaction.occurredAt, 2),
      tone: "success",
    },
    {
      title: "Initiated",
      detail: "Checkout session initialized",
      time: historyTime(transaction.occurredAt, 4),
      tone: "indigo",
    },
  ];

  return (
    <main
      data-slot="transaction-detail-page"
      data-mobile-outline=""
      className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20"
    >
      <div className="hidden flex-col gap-6 md:flex">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link
            href="/transactions"
            className="text-[13px] font-medium leading-none tracking-normal text-slate-500 no-underline"
          >
            Transactions
          </Link>
          <span
            aria-hidden
            className="text-[13px] font-medium leading-none tracking-normal text-slate-500"
          >
            /
          </span>
          <span
            aria-current="page"
            className="text-[13px] font-semibold leading-none tracking-normal text-slate-900"
          >
            {transaction.id}
          </span>
        </nav>

        <section className="flex min-h-30 w-full min-w-0 flex-col justify-between gap-4 rounded-lg border border-solid border-slate-200 bg-white p-6 xl:h-30 xl:flex-row xl:items-center">
          <div className="flex min-w-0 items-center gap-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success-light">
              <ArrowLeftRight aria-hidden className="size-6 text-success" />
            </span>
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="min-w-0 text-[22px] font-bold leading-none tracking-normal text-slate-900">
                  Transaction {transaction.id}
                </h2>
                {transaction.status === "completed" ? (
                  <StatusBadge status="completed">Paid</StatusBadge>
                ) : (
                  <StatusBadge status={transaction.status} />
                )}
              </div>
              <p className="text-[14px] font-normal leading-5 tracking-normal break-words text-slate-500">
                Reference {transaction.reference}
                <span aria-hidden className="px-1.5">
                  •
                </span>
                Generated on {transaction.dateTime}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Button
              variant="ghost"
              size="md"
              onClick={() => printTransaction(transaction)}
              className="h-9.25 w-35.25 gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[14px] font-semibold leading-none tracking-normal text-slate-600"
            >
              <Printer aria-hidden className="size-4" />
              Print Receipt
            </Button>
            <Button
              size="md"
              variant="primary"
              disabled={transaction.status === "refunded"}
              onClick={() => {
                refundTransaction(transaction.id);
                notify({
                  severity: "success",
                  title: "Transaction refunded",
                  description: `${transaction.id} was refunded.`,
                });
              }}
              className="px-4 text-[14px] font-semibold leading-none tracking-normal"
            >
              {transaction.status === "refunded" ? "Refunded" : "Refund Transaction"}
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="flex min-w-0 flex-col gap-4">
            <article className="flex min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
              <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
                Transaction Invoice Details
              </h3>
              <InfoRows
                rows={[
                  {
                    label: "Transaction Type",
                    value: `${TYPE_LABELS[transaction.type]} · ${transaction.description}`,
                  },
                  { label: "Payment Method", value: transaction.method },
                  { label: "Processing Gateway Fee", value: transaction.fee },
                  { label: "Subtotal", value: transaction.subtotal },
                  { label: "Grand Total", value: transaction.amount, prominent: true },
                ]}
              />
            </article>

            <article className="flex h-30.75 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
              <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
                Customer Profile Summary
              </h3>
              <div className="flex items-center gap-3">
                <Avatar
                  size="md"
                  src={transaction.image}
                  alt={transaction.name}
                  className="size-12 text-[18px]"
                >
                  {transaction.initials}
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-[14px] font-semibold leading-4.5 tracking-normal text-slate-900">
                    {transaction.name}
                  </p>
                  <p className="text-[12px] font-normal leading-4 tracking-normal text-slate-500">
                    {transaction.email}
                    <span aria-hidden className="px-1.5">
                      •
                    </span>
                    ID {transaction.accountId}
                  </p>
                </div>
              </div>
            </article>
          </div>

          <article className="flex min-h-63.75 flex-col gap-5 rounded-lg border border-solid border-slate-200 bg-white p-5">
            <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
              Processing History
            </h3>
            <div className="flex flex-col gap-5">
              {history.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full ${item.tone === "success" ? "bg-success-light text-success" : "bg-indigo-50 text-indigo-600"}`}
                  >
                    <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-[13px] font-semibold leading-4.5 tracking-normal text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-[12px] font-normal leading-4 tracking-normal text-slate-600">
                      {item.detail}
                    </p>
                    <p className="text-[11px] font-normal leading-3.5 tracking-normal text-slate-500">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="flex w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-5">
          <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
            Related Customer Ledger Entries
          </h3>
          <div className="w-full overflow-x-auto">
            <div className="w-full min-w-min">
              <div className="ledger-entries-grid grid h-9.75 items-center gap-4 rounded-md bg-slate-50 px-3">
                {["Transaction ID", "Gateway Method", "Amount", "Status", "Settled At"].map(
                  (header) => (
                    <span key={header} className={LEDGER_HEADER}>
                      {header}
                    </span>
                  ),
                )}
              </div>
              {LEDGER_ENTRIES.map((row) => (
                <div
                  key={row.id}
                  className="ledger-entries-grid grid h-11.25 items-center gap-4 border-b border-slate-200 px-3"
                >
                  <span className="whitespace-nowrap text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                    {row.id}
                  </span>
                  <span className="whitespace-nowrap text-[13px] font-normal leading-none tracking-normal text-slate-900">
                    {row.method}
                  </span>
                  <span className="whitespace-nowrap text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                    {row.amount}
                  </span>
                  <StatusBadge status="info">Completed</StatusBadge>
                  <span className="whitespace-nowrap text-[13px] font-normal leading-none tracking-normal text-slate-500">
                    {row.settledAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <TransactionDetailMobile
        transaction={transaction}
        onRefund={() => {
          refundTransaction(transaction.id);
          notify({
            severity: "success",
            title: "Transaction refunded",
            description: `${transaction.id} was refunded.`,
          });
        }}
        onPrint={() => printTransaction(transaction)}
      />
      <MobileTabBar />
    </main>
  );
}

export { TransactionDetailScreen };
