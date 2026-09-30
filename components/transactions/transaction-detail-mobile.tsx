import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StoredTransaction } from "@/lib/transactions-store";

const TYPE_LABELS = {
  payment: "Payment",
  refund: "Refund",
  transfer: "Transfer",
} as const;

function historyTime(occurredAt: number, minutesEarlier: number) {
  return new Date(occurredAt - minutesEarlier * 60 * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function TransactionDetailMobile({
  transaction,
  onRefund,
  onPrint,
}: {
  transaction: StoredTransaction;
  onRefund: () => void;
  onPrint: () => void;
}) {
  const dated = transaction.dateTime.replace(/(\d{4}) (\d)/, "$1, $2");
  const timeline = [
    {
      title: transaction.status === "refunded" ? "Transaction Refunded" : "Transaction Completed",
      detail: "Funds successfully settled into merchant vault.",
      time: historyTime(transaction.occurredAt, 0),
      dotClassName: transaction.status === "failed" ? "bg-error" : "bg-success",
    },
    {
      title: "Processing",
      detail: "Card authenticated via 3D Secure.",
      time: historyTime(transaction.occurredAt, 1),
      dotClassName: "bg-indigo-600",
    },
    {
      title: "Initiated",
      detail: "Payment request received from mobile checkout.",
      time: historyTime(transaction.occurredAt, 2),
      dotClassName: "bg-indigo-600",
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:hidden">
      <article className="box-border flex h-35 w-full flex-col items-center gap-3 rounded-lg border border-solid border-slate-200 bg-white p-5">
        <p className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
          Transaction {transaction.id}
        </p>
        <p className="font-sans text-[32px] font-extrabold leading-none tracking-normal text-slate-900">
          {transaction.amount}
        </p>
        <StatusBadge status={transaction.status} />
      </article>

      <div className="flex w-full gap-3">
          <Button
            variant="primary"
            size="md"
            disabled={transaction.status === "refunded"}
            onClick={onRefund}
            className="h-11 flex-1 rounded-lg px-3 text-[14px] font-semibold leading-none tracking-normal"
          >
            {transaction.status === "refunded" ? "Refunded" : "Refund"}
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={onPrint}
            className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-[14px] font-semibold leading-none tracking-normal text-slate-700 hover:bg-white"
          >
            Print Receipt
          </Button>
      </div>

      <article className="box-border flex h-57.25 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Transaction Details
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "Type", value: `${TYPE_LABELS[transaction.type]} · ${transaction.description}` },
            { label: "Method", value: transaction.method },
            { label: "Date & Time", value: dated },
            { label: "Reference ID", value: transaction.reference },
            { label: "Processing Fee", value: transaction.fee },
          ].map((row) => (
            <div
              key={row.label}
              className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5"
            >
              <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
                {row.label}
              </span>
              <span className="text-right font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="box-border flex h-47.75 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Customer Details
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "Name", value: transaction.name },
            { label: "Email", value: transaction.email },
            { label: "Phone", value: transaction.phone },
            { label: "Account ID", value: transaction.accountId },
          ].map((row) => (
            <div
              key={row.label}
              className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5"
            >
              <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
                {row.label}
              </span>
              <span className="text-right font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="box-border flex h-58.25 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Status Timeline
        </h3>
        <div className="flex flex-col gap-3">
          {timeline.map((item, index) => (
            <div key={item.title} className="relative flex gap-3">
              {index < timeline.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-3 -bottom-3 left-0.75 w-px bg-indigo-200"
                />
              ) : null}
              <span
                aria-hidden
                className={`relative z-10 mt-1 size-2 shrink-0 rounded-full ${item.dotClassName}`}
              />
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="font-sans text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                  {item.title}
                </p>
                <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
                  {item.detail}
                </p>
                <p className="font-sans text-[11px] font-normal leading-none tracking-normal text-slate-400">
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export { TransactionDetailMobile };
