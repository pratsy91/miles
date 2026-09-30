import { ensureUsers, type StoredUser } from "@/lib/users-store";

const STORAGE_KEY = "miles.transactions.v1";

const TYPES = ["payment", "refund", "transfer"] as const;
const PAYMENT_STATUSES = ["completed", "pending", "failed"] as const;
const METHODS = [
  "Credit Card (Visa ending in 4582)",
  "Visa Card (*4582)",
  "Direct PayPal Link",
  "Credit Card (**** 4242)",
] as const;

type TransactionType = (typeof TYPES)[number];
type TransactionStatus = "completed" | "pending" | "refunded" | "failed";

type StoredTransaction = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  accountId: string;
  image: string;
  initials: string;
  description: string;
  type: TransactionType;
  status: TransactionStatus;
  amountValue: number;
  amount: string;
  negative: boolean;
  feeValue: number;
  fee: string;
  subtotal: string;
  method: string;
  reference: string;
  dateTime: string;
  occurredAt: number;
};

type DummyCartProduct = {
  title?: string;
};

type DummyCart = {
  id: number;
  userId: number;
  discountedTotal: number;
  products?: DummyCartProduct[];
};

type DummyUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: string;
};

type Listener = () => void;

const listeners = new Set<Listener>();

function subscribeTransactions(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyTransactions() {
  listeners.forEach((listener) => listener());
}

function randomFrom<T>(items: readonly T[], random: () => number) {
  return items[Math.floor(random() * items.length)] ?? items[0];
}

function randomizer(seed: number) {
  let value = seed % 233280;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

function formatMoney(value: number, negative = false) {
  const formatted = Math.abs(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  return negative ? `-${formatted}` : formatted;
}

function formatDateTime(date: Date) {
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart} ${timePart}`;
}

function customerFromUser(user: StoredUser | DummyUser, accountId?: string) {
  if ("displayId" in user) {
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      accountId: user.displayId,
      image: user.image,
      initials: user.initials,
    };
  }

  const name = `${user.firstName} ${user.lastName}`.trim();
  return {
    name,
    email: user.email,
    phone: user.phone,
    accountId: accountId ?? `#USR-${String(user.id).padStart(4, "0")}`,
    image: user.image ?? "",
    initials: initialsFrom(name),
  };
}

function toStoredTransaction(
  cart: DummyCart,
  customer: ReturnType<typeof customerFromUser>,
): StoredTransaction {
  const random = randomizer(cart.id + 17);
  const type = randomFrom(TYPES, random);
  const status: TransactionStatus =
    type === "refund" ? "refunded" : randomFrom(PAYMENT_STATUSES, random);
  const negative = type === "refund";
  const amountValue = Math.round(cart.discountedTotal * 100) / 100;
  const feeValue = Math.round((2 + random() * 8) * 100) / 100;
  const within30 = random() < 0.7;
  const ageDays = within30 ? random() * 30 : 30 + random() * 60;
  const occurredAt = Date.now() - ageDays * 24 * 60 * 60 * 1000;
  const referenceNumber = Math.floor(100000000 + random() * 900000000);

  return {
    id: `#TXN-${String(cart.id).padStart(4, "0")}`,
    userId: String(cart.userId),
    ...customer,
    description: cart.products?.[0]?.title || "Service Payment",
    type,
    status,
    amountValue,
    amount: formatMoney(amountValue, negative),
    negative,
    feeValue,
    fee: formatMoney(feeValue),
    subtotal: formatMoney(Math.max(0, amountValue - feeValue)),
    method: randomFrom(METHODS, random),
    reference: `ref_${referenceNumber}`,
    dateTime: formatDateTime(new Date(occurredAt)),
    occurredAt,
  };
}

function readTransactions(): StoredTransaction[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredTransaction[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeTransactions(transactions: StoredTransaction[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  notifyTransactions();
}

async function loadCustomer(
  userId: number,
  usersById: Map<string, StoredUser>,
) {
  const stored = usersById.get(String(userId));
  if (stored) {
    return customerFromUser(stored);
  }

  const response = await fetch(`https://dummyjson.com/users/${userId}`);
  if (!response.ok) {
    return {
      name: `User ${userId}`,
      email: "—",
      phone: "—",
      accountId: `#USR-${String(userId).padStart(4, "0")}`,
      image: "",
      initials: "U",
    };
  }

  const user = (await response.json()) as DummyUser;
  return customerFromUser(user);
}

let loadingTransactions: Promise<StoredTransaction[]> | null = null;

async function ensureTransactions(): Promise<StoredTransaction[]> {
  const existing = readTransactions();
  if (existing && existing.length > 0) {
    return existing;
  }

  if (loadingTransactions) {
    return loadingTransactions;
  }

  loadingTransactions = (async () => {
    const [users, response] = await Promise.all([
      ensureUsers(),
      fetch("https://dummyjson.com/carts?limit=50"),
    ]);

    if (!response.ok) {
      throw new Error("Could not load transactions");
    }

    const saved = readTransactions();
    if (saved && saved.length > 0) {
      return saved;
    }

    const data = (await response.json()) as { carts: DummyCart[] };
    const usersById = new Map(users.map((user) => [user.id, user]));
    const uniqueIds = [...new Set(data.carts.map((cart) => cart.userId))];
    const customers = new Map(
      await Promise.all(
        uniqueIds.map(async (userId) => [userId, await loadCustomer(userId, usersById)] as const),
      ),
    );

    const transactions = data.carts.map((cart) =>
      toStoredTransaction(
        cart,
        customers.get(cart.userId) ?? {
          name: `User ${cart.userId}`,
          email: "—",
          phone: "—",
          accountId: `#USR-${String(cart.userId).padStart(4, "0")}`,
          image: "",
          initials: "U",
        },
      ),
    );
    writeTransactions(transactions);
    return transactions;
  })().finally(() => {
    loadingTransactions = null;
  });

  return loadingTransactions;
}

function updateTransaction(id: string, patch: Partial<StoredTransaction>) {
  const transactions = readTransactions() ?? [];
  const next = transactions.map((transaction) =>
    transaction.id === id ? { ...transaction, ...patch } : transaction,
  );
  writeTransactions(next);
  return next.find((transaction) => transaction.id === id) ?? null;
}

function refundTransaction(id: string) {
  const current = (readTransactions() ?? []).find((transaction) => transaction.id === id);
  if (!current || current.status === "refunded") {
    return current ?? null;
  }

  return updateTransaction(id, {
    type: "refund",
    status: "refunded",
    negative: true,
    amount: formatMoney(current.amountValue, true),
  });
}

export {
  ensureTransactions,
  readTransactions,
  refundTransaction,
  subscribeTransactions,
  updateTransaction,
};
export type { StoredTransaction, TransactionStatus, TransactionType };
