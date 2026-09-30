"use client";

import { useStoredList } from "@/hooks/use-stored-list";
import { ensureUsers, readUsers, subscribeUsers } from "@/lib/users-store";

function useUsers() {
  const { items, error, loading, reload } = useStoredList(
    ensureUsers,
    readUsers,
    subscribeUsers,
    "Could not load users.",
  );

  return { users: items, error, loading, reload };
}

export { useUsers };
