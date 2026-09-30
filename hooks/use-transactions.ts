"use client";

import { useStoredList } from "@/hooks/use-stored-list";
import {
  ensureTransactions,
  readTransactions,
  subscribeTransactions,
} from "@/lib/transactions-store";

function useTransactions() {
  const { items, error, loading, reload } = useStoredList(
    ensureTransactions,
    readTransactions,
    subscribeTransactions,
    "Could not load transactions.",
  );

  return { transactions: items, error, loading, reload };
}

export { useTransactions };
