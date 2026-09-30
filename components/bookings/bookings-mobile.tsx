import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataEmpty, DataError, ListPagination, ListSkeleton } from "@/components/ui/data-state";
import type { StoredBooking } from "@/lib/bookings-store";
import { Filter, Pencil, Plus, Search } from "lucide-react";
import Link from "next/link";

function BookingsMobile({
  bookings,
  total,
  page,
  pageSize,
  onPrevious,
  onNext,
  stats,
  loading,
  error,
  onRetry,
  query,
  onQueryChange,
  onCreate,
}: {
  bookings: StoredBooking[];
  total: number;
  page: number;
  pageSize: number;
  onPrevious: () => void;
  onNext: () => void;
  stats: { total: string; active: string; completed: string; cancelled: string };
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  onCreate: () => void;
}) {
  const mobileStats = [
    { label: "Total Bookings", value: stats.total, valueClassName: "text-slate-900" },
    { label: "Active Sessions", value: stats.active, valueClassName: "text-indigo-600" },
    { label: "Completed", value: stats.completed, valueClassName: "text-success-dark" },
    { label: "Cancelled", value: stats.cancelled, valueClassName: "text-error-dark" },
  ];
  return (
    <div className="flex flex-col gap-4 md:hidden">
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-[18px] font-bold leading-none tracking-normal text-slate-900">
          Active Bookings
        </h2>
        <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
          Manage and schedule corporate bookings
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label className="box-border flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-solid border-slate-200 bg-white px-3 py-2">
          <Search aria-hidden className="size-4 shrink-0 text-slate-400" />
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search bookings..."
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-none tracking-normal text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
        <button
          type="button"
          aria-label="Filter bookings"
          className="box-border flex size-9 shrink-0 items-center justify-center rounded-lg border border-solid border-slate-200 bg-white text-slate-600"
        >
          <Filter aria-hidden className="size-4" />
        </button>
      </div>

      <section className="grid grid-cols-2 gap-2">
        {mobileStats.map((stat) => (
          <article
            key={stat.label}
            className="box-border flex h-15 min-w-0 flex-col gap-1 rounded-lg border border-solid border-slate-200 bg-white p-3"
          >
            <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
              {stat.label}
            </p>
            <p
              className={`font-sans text-[16px] font-bold leading-none tracking-normal ${stat.valueClassName}`}
            >
              {stat.value}
            </p>
          </article>
        ))}
      </section>

      <Button
        variant="primary"
        size="md"
        onClick={onCreate}
        className="box-border h-10! w-full gap-1 rounded-lg p-3! font-sans text-[13px]! font-semibold! leading-none tracking-normal"
      >
        <Plus aria-hidden className="size-3" />
        Create New Booking
      </Button>

      <div className="flex flex-col gap-3">
        {loading ? <ListSkeleton variant="cards" rows={4} /> : null}
        {error ? <DataError message={error} onRetry={onRetry} /> : null}
        {!loading && !error && total === 0 ? (
          <DataEmpty title="No bookings" description="No bookings match these filters." />
        ) : null}
        {!loading && !error
          ? bookings.map((booking) => (
          <article
            key={booking.id}
            id={`booking-${booking.id.slice(1)}`}
            className="relative box-border flex h-33.5 w-full flex-col rounded-lg border border-solid border-slate-200 bg-white p-3"
          >
            <Link
              href={`/bookings/${booking.id.slice(1)}`}
              aria-label={`View ${booking.id}`}
              className="absolute inset-0 rounded-lg"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-[13px] font-bold leading-none tracking-normal text-slate-900">
                {booking.id}
              </span>
              <StatusBadge status={booking.status} />
            </div>
            <div className="mt-2.5 h-0 w-full border-t border-solid border-slate-200" />
            <div className="mt-2.5 flex items-center">
              <Avatar
                size="sm"
                src={booking.image}
                alt={booking.name}
                className="size-6 rounded-xl text-[10px]"
              >
                {booking.initials}
              </Avatar>
              <div className="ml-2 min-w-0 flex-1">
                <p className="truncate font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
                  {booking.name}
                </p>
                <p className="mt-1 truncate text-[12px] font-normal leading-none tracking-normal text-slate-500">
                  {booking.service}
                </p>
              </div>
              <span className="shrink-0 font-sans text-[13px] font-bold leading-none tracking-normal text-slate-900">
                {booking.amount}
              </span>
            </div>
            <div className="mt-5.5 flex items-center justify-between gap-3">
              <p className="font-sans text-[10px] font-normal leading-none tracking-normal text-slate-500">
                {booking.dateTime}
              </p>
              <Link
                href={`/bookings/${booking.id.slice(1)}`}
                aria-label={`Edit ${booking.id}`}
                className="relative z-10 flex size-6 items-center justify-center text-slate-400"
              >
                <Pencil aria-hidden className="size-4" />
              </Link>
            </div>
          </article>
        ))
          : null}
        {!loading && !error && total > 0 ? (
          <ListPagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        ) : null}
      </div>
    </div>
  );
}

export { BookingsMobile };
