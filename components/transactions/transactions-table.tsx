import { StatusBadge } from "@/components/ui/badge";
import { DataEmpty, ListPagination } from "@/components/ui/data-state";
import { Avatar } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import Link from "next/link";

const HEADER_CELL =
  "text-[12px] font-semibold leading-none tracking-normal text-slate-500 uppercase";

const AMOUNT_TEXT =
  "text-[13px] font-semibold leading-none tracking-normal";

type TransactionType = "payment" | "refund" | "transfer";
type TransactionStatus = "completed" | "pending" | "refunded" | "failed";

type TransactionRow = {
  id: string;
  name: string;
  initials: string;
  image?: string;
  type: TransactionType;
  amount: string;
  negative?: boolean;
  status: TransactionStatus;
  dateTime: string;
};

const TYPE_LABELS: Record<TransactionType, string> = {
  payment: "Payment",
  refund: "Refund",
  transfer: "Transfer",
};

const TYPE_STATUS = {
  payment: "info",
  refund: "failed",
  transfer: "info",
} as const;

function TransactionsTableRow({ transaction }: { transaction: TransactionRow }) {
  return (
    <div
      role="row"
      className="transactions-table-grid grid h-14 items-center gap-4 border-b border-slate-200 px-3"
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
      <StatusBadge status={TYPE_STATUS[transaction.type]}>
        {TYPE_LABELS[transaction.type]}
      </StatusBadge>
      <span
        className={`${AMOUNT_TEXT} ${transaction.negative ? "text-error" : "text-slate-900"}`}
      >
        {transaction.amount}
      </span>
      <StatusBadge status={transaction.status} />
      <span className="text-[13px] font-normal leading-none tracking-normal text-slate-600">
        {transaction.dateTime}
      </span>
      <div className="flex items-center justify-start">
        <Link
          href={`/transactions/${transaction.id.slice(1)}`}
          aria-label={`View ${transaction.id}`}
          className="text-slate-600"
        >
          <Eye aria-hidden className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function TransactionsTable({
  transactions,
  page,
  pageSize,
  total,
  onPrevious,
  onNext,
}: {
  transactions: TransactionRow[];
  page: number;
  pageSize: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <section className="flex w-full flex-col rounded-lg border border-solid border-slate-200 bg-white p-5">
      <div className="w-full overflow-x-auto">
        <div className="w-full min-w-min min-[1200px]:min-w-238.5">
          <div
            role="row"
            className="transactions-table-grid grid h-10 items-center gap-4 rounded-md bg-slate-50 px-3"
          >
            <span role="columnheader" className={HEADER_CELL}>
              Transaction ID
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              User
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Type
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Amount
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Status
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Date & Time
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Actions
            </span>
          </div>
          {transactions.length === 0 ? (
            <DataEmpty
              title="No transactions"
              description="No transactions match these filters."
            />
          ) : (
            transactions.map((transaction) => (
              <TransactionsTableRow key={transaction.id} transaction={transaction} />
            ))
          )}
        </div>
      </div>
      <ListPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </section>
  );
}

export { TransactionsTable };
