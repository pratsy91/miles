import type { StoredTransaction } from "@/lib/transactions-store";

function netRevenue(transaction: StoredTransaction) {
  if (transaction.status === "pending" || transaction.status === "failed") {
    return 0;
  }

  return transaction.negative || transaction.status === "refunded"
    ? -transaction.amountValue
    : transaction.amountValue;
}

export { netRevenue };
