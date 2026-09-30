"use client";

import { useStoredList } from "@/hooks/use-stored-list";
import { ensureBookings, readBookings, subscribeBookings } from "@/lib/bookings-store";

function useBookings() {
  const { items, error, loading, reload } = useStoredList(
    ensureBookings,
    readBookings,
    subscribeBookings,
    "Could not load bookings.",
  );

  return { bookings: items, error, loading, reload };
}

export { useBookings };
