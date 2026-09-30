import { ensureUsers, readUsers, type StoredUser } from "@/lib/users-store";

const STORAGE_KEY = "miles.bookings.v1";

const STATUSES = ["confirmed", "completed", "pending", "cancelled"] as const;
const DURATIONS = [60, 90, 120] as const;
const LOCATIONS = [
  "Virtual - Zoom Link Provided",
  "Virtual Consultation Room",
  "Virtual (Zoom link enclosed)",
] as const;
const METHODS = [
  "Invoiced (Credit Card)",
  "Credit Card (Visa ending in 4582)",
  "Direct PayPal Link",
] as const;

type BookingStatus = (typeof STATUSES)[number];

type StoredBooking = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  initials: string;
  service: string;
  notes: string;
  status: BookingStatus;
  amountValue: number;
  amount: string;
  durationMinutes: number;
  duration: string;
  occurredAt: number;
  dateTime: string;
  scheduledDate: string;
  dateLabel: string;
  timeSlot: string;
  location: string;
  method: string;
  invoice: string;
  paid: boolean;
  premium: boolean;
};

type DummyProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
};

type Listener = () => void;

const listeners = new Set<Listener>();

function subscribeBookings(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyBookings() {
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

function formatMoney(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatDuration(minutes: number) {
  const hours = minutes / 60;
  return hours === 1 ? "1.0 hr" : `${hours.toFixed(1)} hrs`;
}

function formatClock(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function scheduleFrom(start: Date, durationMinutes: number) {
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const dateLabel = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = start.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    dateTime: `${dateLabel} ${time}`,
    scheduledDate: start.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    dateLabel,
    timeSlot: `${formatClock(start)} - ${formatClock(end)} (EST)`,
  };
}

function customerFrom(user: StoredUser) {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    initials: user.initials,
  };
}

function toStoredBooking(product: DummyProduct, user: StoredUser): StoredBooking {
  const random = randomizer(product.id + 41);
  const durationMinutes = randomFrom(DURATIONS, random);
  const upcoming = random() < 0.55;
  const ageDays = upcoming ? -(1 + random() * 21) : random() * 45;
  const start = new Date(Date.now() + ageDays * 24 * 60 * 60 * 1000);
  start.setMinutes(random() < 0.5 ? 0 : 30, 0, 0);
  const notes = product.description.replace(/\s+/g, " ").trim();

  return {
    id: `#BKG-${String(product.id).padStart(4, "0")}`,
    ...customerFrom(user),
    service: product.title,
    notes: notes.length > 220 ? `${notes.slice(0, 217)}...` : notes,
    status: randomFrom(STATUSES, random),
    amountValue: Math.round(product.price * 100) / 100,
    amount: formatMoney(product.price),
    durationMinutes,
    duration: formatDuration(durationMinutes),
    occurredAt: start.getTime(),
    ...scheduleFrom(start, durationMinutes),
    location: randomFrom(LOCATIONS, random),
    method: randomFrom(METHODS, random),
    invoice: `#INV-${Math.floor(10000 + random() * 90000)}`,
    paid: random() > 0.2,
    premium: random() > 0.6,
  };
}

function readBookings(): StoredBooking[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredBooking[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeBookings(bookings: StoredBooking[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  notifyBookings();
}

let loadingBookings: Promise<StoredBooking[]> | null = null;

async function ensureBookings(): Promise<StoredBooking[]> {
  const existing = readBookings();
  if (existing && existing.length > 0) {
    return existing;
  }

  if (loadingBookings) {
    return loadingBookings;
  }

  loadingBookings = (async () => {
    const [users, response] = await Promise.all([
      ensureUsers(),
      fetch("https://dummyjson.com/products?limit=50"),
    ]);

    if (!response.ok) {
      throw new Error("Could not load bookings");
    }

    const saved = readBookings();
    if (saved && saved.length > 0) {
      return saved;
    }

    const data = (await response.json()) as { products: DummyProduct[] };
    const roster = users.length
      ? users
      : [
          {
            id: "0",
            displayId: "#USR-0000",
            name: "Guest Customer",
            email: "guest@example.com",
            phone: "—",
            birthDate: "",
            address: "",
            image: "",
            initials: "GC",
            role: "viewer" as const,
            status: "active" as const,
            joinDate: "",
            joinTime: 0,
            lastActive: "",
            twoFactor: false,
          },
        ];

    const bookings = data.products.map((product, index) =>
      toStoredBooking(product, roster[index % roster.length]),
    );
    writeBookings(bookings);
    return bookings;
  })().finally(() => {
    loadingBookings = null;
  });

  return loadingBookings;
}

function updateBooking(id: string, patch: Partial<StoredBooking>) {
  const bookings = readBookings() ?? [];
  const next = bookings.map((booking) =>
    booking.id === id ? { ...booking, ...patch } : booking,
  );
  writeBookings(next);
  return next.find((booking) => booking.id === id) ?? null;
}

function cancelBooking(id: string) {
  const current = (readBookings() ?? []).find((booking) => booking.id === id);
  if (!current || current.status === "cancelled") {
    return current ?? null;
  }

  return updateBooking(id, { status: "cancelled" });
}

function rescheduleBooking(id: string) {
  const current = (readBookings() ?? []).find((booking) => booking.id === id);
  if (!current || current.status === "cancelled") {
    return current ?? null;
  }

  const start = new Date(current.occurredAt + 24 * 60 * 60 * 1000);
  return updateBooking(id, {
    status: current.status === "completed" ? "confirmed" : current.status,
    occurredAt: start.getTime(),
    ...scheduleFrom(start, current.durationMinutes),
  });
}

function addBooking(input: {
  user?: StoredUser | null;
  userId?: string;
  service: string;
  amountValue: number;
  durationMinutes: number;
  start: Date;
}) {
  const user =
    input.user ??
    (readUsers() ?? []).find((item) => item.id === String(input.userId ?? ""));
  if (!user) {
    return null;
  }

  const bookings = readBookings() ?? [];
  let nextNumber =
    bookings.reduce((max, booking) => {
      const value = Number(booking.id.replace(/\D/g, ""));
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0) + 1;
  let id = `#BKG-${String(nextNumber).padStart(4, "0")}`;
  while (bookings.some((booking) => booking.id === id)) {
    nextNumber += 1;
    id = `#BKG-${String(nextNumber).padStart(4, "0")}`;
  }

  const booking: StoredBooking = {
    id,
    ...customerFrom(user),
    service: input.service.trim(),
    notes: "New booking",
    status: "confirmed",
    amountValue: Math.round(input.amountValue * 100) / 100,
    amount: formatMoney(input.amountValue),
    durationMinutes: input.durationMinutes,
    duration: formatDuration(input.durationMinutes),
    occurredAt: input.start.getTime(),
    ...scheduleFrom(input.start, input.durationMinutes),
    location: LOCATIONS[0],
    method: METHODS[0],
    invoice: `#INV-${String(nextNumber).padStart(5, "0")}`,
    paid: false,
    premium: false,
  };

  writeBookings([booking, ...bookings]);
  return booking;
}

function isActiveBooking(booking: StoredBooking) {
  return booking.status === "confirmed" || booking.status === "pending";
}

export {
  addBooking,
  cancelBooking,
  ensureBookings,
  isActiveBooking,
  readBookings,
  rescheduleBooking,
  subscribeBookings,
  updateBooking,
};
export type { BookingStatus, StoredBooking };
