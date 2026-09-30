"use client";

import { useBookings } from "@/hooks/use-bookings";
import { useTransactions } from "@/hooks/use-transactions";
import { useUsers } from "@/hooks/use-users";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

const GROUP_LIMIT = 4;

type SearchHit = {
  key: string;
  group: "Users" | "Transactions" | "Bookings";
  href: string;
  title: string;
  meta: string;
};

function matches(query: string, parts: string[]) {
  return parts.join(" ").toLowerCase().includes(query);
}

function ConsoleSearch() {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLLabelElement>(null);
  const { users, loading: usersLoading } = useUsers();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { bookings, loading: bookingsLoading } = useBookings();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const trimmed = query.trim().toLowerCase();
  const loading = usersLoading || transactionsLoading || bookingsLoading;

  const hits = useMemo(() => {
    if (!trimmed) {
      return [];
    }

    const next: SearchHit[] = [];

    for (const user of users ?? []) {
      if (!matches(trimmed, [user.name, user.email, user.displayId, user.id])) {
        continue;
      }
      next.push({
        key: `user-${user.id}`,
        group: "Users",
        href: `/users/${user.id}`,
        title: user.name,
        meta: `${user.displayId} · ${user.email}`,
      });
      if (next.length === GROUP_LIMIT) {
        break;
      }
    }

    let transactionCount = 0;
    for (const transaction of transactions ?? []) {
      if (
        !matches(trimmed, [
          transaction.id,
          transaction.name,
          transaction.amount,
          String(transaction.amountValue),
          transaction.description,
        ])
      ) {
        continue;
      }
      next.push({
        key: `transaction-${transaction.id}`,
        group: "Transactions",
        href: `/transactions/${transaction.id.slice(1)}`,
        title: transaction.name,
        meta: `${transaction.id} · ${transaction.amount}`,
      });
      transactionCount += 1;
      if (transactionCount === GROUP_LIMIT) {
        break;
      }
    }

    let bookingCount = 0;
    for (const booking of bookings ?? []) {
      if (!matches(trimmed, [booking.id, booking.name, booking.service, booking.email])) {
        continue;
      }
      next.push({
        key: `booking-${booking.id}`,
        group: "Bookings",
        href: `/bookings/${booking.id.slice(1)}`,
        title: booking.name,
        meta: `${booking.id} · ${booking.service}`,
      });
      bookingCount += 1;
      if (bookingCount === GROUP_LIMIT) {
        break;
      }
    }

    return next;
  }, [bookings, transactions, trimmed, users]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(hits.length === 1 ? 0 : -1);
  }, [hits.length, trimmed]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function place() {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      const width = 320;
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(8, rect.right - width),
      });
    }

    function onPointerDown(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (rootRef.current?.contains(target)) {
        return;
      }
      if (target instanceof Element && target.closest("[data-console-search-results]")) {
        return;
      }
      setOpen(false);
    }

    place();
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  function go(href: string) {
    setQuery("");
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (!open || hits.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % hits.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? hits.length - 1 : index - 1));
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const hit = hits[activeIndex];
      if (hit) {
        go(hit.href);
      }
    }
  }

  const showResults = open && trimmed.length > 0 && mounted;

  return (
    <>
      <label
        ref={rootRef}
        className="flex h-8 w-60 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
      >
        <Search aria-hidden className="size-4 shrink-0 text-slate-400" />
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          value={query}
          placeholder="Search console..."
          aria-label="Search console"
          aria-expanded={showResults}
          aria-controls={listId}
          aria-autocomplete="list"
          role="combobox"
          className="min-w-0 flex-1 bg-transparent text-[13px] font-normal leading-none tracking-normal text-slate-900 outline-none placeholder:text-slate-400"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </label>
      {showResults
        ? createPortal(
            <div
              id={listId}
              data-console-search-results
              role="listbox"
              style={{ top: position.top, left: position.left }}
              className="fixed z-50 max-h-90 w-[320px] overflow-y-auto rounded-lg border border-solid border-slate-200 bg-white py-1 shadow-ds-md"
            >
              {loading && hits.length === 0 ? (
                <p className="px-3 py-2 font-sans text-[13px] leading-none tracking-normal text-slate-500">
                  Searching...
                </p>
              ) : null}
              {!loading && hits.length === 0 ? (
                <p className="px-3 py-2 font-sans text-[13px] leading-none tracking-normal text-slate-500">
                  No matches
                </p>
              ) : null}
              {hits.map((hit, index) => {
                const showGroup = index === 0 || hits[index - 1]?.group !== hit.group;
                const active = index === activeIndex;
                return (
                  <div key={hit.key}>
                    {showGroup ? (
                      <p className="px-3 pt-2 pb-1 font-sans text-[11px] font-semibold leading-none tracking-normal text-slate-500">
                        {hit.group}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`flex w-full flex-col items-start gap-1 px-3 py-2 text-left ${
                        active ? "bg-indigo-50" : "bg-white"
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => go(hit.href)}
                    >
                      <span className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
                        {hit.title}
                      </span>
                      <span className="max-w-full truncate font-sans text-[11px] font-normal leading-none tracking-normal text-slate-500">
                        {hit.meta}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export { ConsoleSearch };
