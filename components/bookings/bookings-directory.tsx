"use client";

import { AddBookingDialog } from "@/components/bookings/add-booking-dialog";
import { BookingsMobile } from "@/components/bookings/bookings-mobile";
import { BookingsTable } from "@/components/bookings/bookings-table";
import { DirectoryHeader } from "@/components/layout/directory-header";
import { FiltersBar } from "@/components/layout/filters-bar";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { DataError, ListSkeleton } from "@/components/ui/data-state";
import { KpiCard } from "@/components/ui/kpi-card";
import { useBookings } from "@/hooks/use-bookings";
import { isActiveBooking, type StoredBooking } from "@/lib/bookings-store";
import { formatCount, monthStart, percentChange } from "@/lib/format";
import { Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 8;

function bookingStats(bookings: StoredBooking[] | null) {
  if (bookings == null) {
    return {
      total: "—",
      active: "—",
      completed: "—",
      cancelled: "—",
      trends: {
        total: { trend: "—", variant: "neutral" as const },
        active: { trend: "—", variant: "neutral" as const },
        completed: { trend: "—", variant: "neutral" as const },
        cancelled: { trend: "—", variant: "neutral" as const },
      },
    };
  }

  const start = monthStart();
  const count = (match: (booking: StoredBooking) => boolean, beforeMonth: boolean) =>
    bookings.filter(
      (booking) => match(booking) && (!beforeMonth || booking.occurredAt < start),
    ).length;

  const total = count(() => true, false);
  const active = count(isActiveBooking, false);
  const completed = count((booking) => booking.status === "completed", false);
  const cancelled = count((booking) => booking.status === "cancelled", false);

  return {
    total: formatCount(total),
    active: formatCount(active),
    completed: formatCount(completed),
    cancelled: formatCount(cancelled),
    trends: {
      total: percentChange(total, count(() => true, true)),
      active: percentChange(active, count(isActiveBooking, true)),
      completed: percentChange(
        completed,
        count((booking) => booking.status === "completed", true),
      ),
      cancelled: percentChange(
        cancelled,
        count((booking) => booking.status === "cancelled", true),
      ),
    },
  };
}

function matchesQuery(booking: StoredBooking, query: string) {
  const value = query.trim().toLowerCase();
  if (!value) {
    return true;
  }

  return (
    booking.id.toLowerCase().includes(value) ||
    booking.name.toLowerCase().includes(value) ||
    booking.service.toLowerCase().includes(value)
  );
}

function BookingsDirectory() {
  const { bookings, loading, error, reload } = useBookings();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [when, setWhen] = useState("All");
  const [page, setPage] = useState(0);
  const [addingBooking, setAddingBooking] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const now = Date.now();
    const next = (bookings ?? []).filter((booking) => {
      const matchesStatus = status === "All" || booking.status === status.toLowerCase();
      const matchesWhen =
        when === "All" ||
        (when === "Upcoming" ? booking.occurredAt >= now : booking.occurredAt < now);
      return matchesQuery(booking, query) && matchesStatus && matchesWhen;
    });

    next.sort((left, right) => right.occurredAt - left.occurredAt);
    return next;
  }, [bookings, query, status, when]);

  useEffect(() => {
    setPage(0);
  }, [query, status, when]);

  useEffect(() => {
    if (!focusId) {
      return;
    }

    const index = filtered.findIndex((booking) => booking.id === focusId);
    if (index < 0) {
      return;
    }

    setPage(Math.floor(index / PAGE_SIZE));
    const card = document.getElementById(`booking-${focusId.slice(1)}`);
    if (card && card.getClientRects().length > 0) {
      card.scrollIntoView({ block: "center" });
    }
    setFocusId(null);
  }, [filtered, focusId]);

  const pageBookings = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const stats = bookingStats(bookings);
  const bookingKpis = [
    { title: "Total Bookings", value: stats.total, ...stats.trends.total },
    { title: "Active Bookings", value: stats.active, ...stats.trends.active },
    { title: "Completed Bookings", value: stats.completed, ...stats.trends.completed },
    { title: "Cancelled Bookings", value: stats.cancelled, ...stats.trends.cancelled },
  ];

  return (
    <main
      data-slot="bookings-page"
      className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20"
    >
      <div className="hidden flex-col gap-6 md:flex">
        <DirectoryHeader
          title="Bookings Directory"
          subtitle="Manage all service bookings and consultation meetings"
          actionLabel="New Booking"
          onAction={() => setAddingBooking(true)}
        />
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {bookingKpis.map((kpi) => (
            <KpiCard
              key={kpi.title}
              icon={Calendar}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              subtitle="vs last month"
              variant={kpi.variant}
            />
          ))}
        </section>
        <FiltersBar
          searchPlaceholder="Search bookings..."
          search={query}
          onSearchChange={setQuery}
          filters={[
            {
              label: "Status",
              value: status,
              options: ["All", "Confirmed", "Completed", "Pending", "Cancelled"],
              onChange: setStatus,
            },
            {
              label: "When",
              value: when,
              options: ["All", "Upcoming", "Past"],
              onChange: setWhen,
            },
          ]}
        />
        {loading ? (
          <ListSkeleton rows={8} />
        ) : error ? (
          <DataError message={error} onRetry={reload} />
        ) : (
          <BookingsTable
            bookings={pageBookings}
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPrevious={() => setPage((current) => Math.max(0, current - 1))}
            onNext={() =>
              setPage((current) =>
                (current + 1) * PAGE_SIZE >= filtered.length ? current : current + 1,
              )
            }
          />
        )}
      </div>
      <BookingsMobile
        bookings={pageBookings}
        total={filtered.length}
        page={page}
        pageSize={PAGE_SIZE}
        onPrevious={() => setPage((current) => Math.max(0, current - 1))}
        onNext={() =>
          setPage((current) =>
            (current + 1) * PAGE_SIZE >= filtered.length ? current : current + 1,
          )
        }
        stats={stats}
        loading={loading}
        error={error}
        onRetry={reload}
        query={query}
        onQueryChange={setQuery}
        onCreate={() => setAddingBooking(true)}
      />
      <AddBookingDialog
        open={addingBooking}
        onClose={() => setAddingBooking(false)}
        onAdded={(id) => {
          setQuery("");
          setStatus("All");
          setWhen("All");
          setFocusId(id);
        }}
      />
      <MobileTabBar />
    </main>
  );
}

export { BookingsDirectory };
