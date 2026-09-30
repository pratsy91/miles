"use client";

import { BookingDetailMobile } from "@/components/bookings/booking-detail-mobile";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { InfoRows } from "@/components/users/user-detail-columns";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataEmpty, DataError, DetailSkeleton } from "@/components/ui/data-state";
import { useAlerts } from "@/components/ui/alerts";
import { useBookings } from "@/hooks/use-bookings";
import { cancelBooking, rescheduleBooking, type StoredBooking } from "@/lib/bookings-store";
import { Calendar, Check } from "lucide-react";
import Link from "next/link";

function findBooking(bookings: StoredBooking[], id: string) {
  const decoded = decodeURIComponent(id);
  const normalized = decoded.startsWith("#") ? decoded : `#${decoded}`;
  return bookings.find((item) => item.id === normalized) ?? null;
}

function logTime(occurredAt: number, hoursEarlier: number) {
  return new Date(occurredAt - hoursEarlier * 60 * 60 * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function BookingDetailScreen({ id }: { id: string }) {
  const { bookings, loading, error, reload } = useBookings();
  const notify = useAlerts();
  const booking = bookings ? findBooking(bookings, id) : null;
  const previousCount = booking
    ? (bookings ?? []).filter(
        (item) =>
          item.userId === booking.userId && item.id !== booking.id && item.status === "completed",
      ).length
    : 0;

  if (loading) {
    return (
      <main data-mobile-outline="" className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20">
        <DetailSkeleton />
        <MobileTabBar />
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main data-mobile-outline="" className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20">
        {error ? (
          <DataError message={error} onRetry={reload} />
        ) : (
          <DataEmpty title="Booking not found" description="This booking is not in the directory." />
        )}
        <MobileTabBar />
      </main>
    );
  }

  const cancelled = booking.status === "cancelled";
  const history = [
    {
      title: cancelled ? "Booking Cancelled" : "Confirmation Sent",
      detail: cancelled ? "Session cancelled by an administrator" : "Outlook invite dispatched",
      time: logTime(booking.occurredAt, 2),
    },
    {
      title: cancelled ? "Cancellation Requested" : "Status Set to Confirmed",
      detail: cancelled ? "Customer session removed from the calendar" : "Consultant assigned automatically",
      time: logTime(booking.occurredAt, 24),
    },
    {
      title: "Booking Created",
      detail: "Client self-service reservation",
      time: logTime(booking.occurredAt, 25),
    },
  ];

  return (
    <main
      data-slot="booking-detail-page"
      data-mobile-outline=""
      className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20"
    >
      <div className="hidden flex-col gap-6 md:flex">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link
            href="/bookings"
            className="text-[13px] font-medium leading-none tracking-normal text-slate-500 no-underline"
          >
            Bookings
          </Link>
          <span
            aria-hidden
            className="text-[13px] font-medium leading-none tracking-normal text-slate-500"
          >
            /
          </span>
          <span
            aria-current="page"
            className="text-[13px] font-semibold leading-none tracking-normal text-slate-900"
          >
            {booking.id}
          </span>
        </nav>

        <section className="flex min-h-30 w-full flex-col justify-between gap-4 rounded-lg border border-solid border-slate-200 bg-white p-6 sm:h-30 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-50">
              <Calendar aria-hidden className="size-6 text-indigo-600" />
            </span>
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[22px] font-bold leading-none tracking-normal text-slate-900">
                  Booking {booking.id}
                </h2>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-[14px] font-normal leading-none tracking-normal text-slate-500">
                {booking.location}
                <span aria-hidden className="px-1.5">
                  •
                </span>
                Scheduled for {booking.dateLabel} at {booking.dateTime.split(" ").slice(-1)[0]}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="ghost"
              size="md"
              disabled={cancelled}
              onClick={() => {
                const next = rescheduleBooking(booking.id);
                if (!next) {
                  return;
                }
                notify({
                  severity: "info",
                  title: "Booking rescheduled",
                  description: `${next.id} is now scheduled for ${next.dateLabel}.`,
                });
              }}
              className="h-9.25 gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[14px] font-semibold leading-none tracking-normal text-slate-600"
            >
              <Calendar aria-hidden className="size-4" />
              Reschedule
            </Button>
            <Button
              variant="ghost"
              size="md"
              disabled={cancelled}
              onClick={() => {
                cancelBooking(booking.id);
                notify({
                  severity: "warning",
                  title: "Booking cancelled",
                  description: `${booking.id} was cancelled.`,
                });
              }}
              className="h-9.25 rounded-lg bg-error-light px-4 text-[14px] font-semibold leading-none tracking-normal text-error-dark hover:bg-error-light"
            >
              {cancelled ? "Cancelled" : "Cancel Booking"}
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="flex min-w-0 flex-col gap-4">
            <article className="flex min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
              <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
                Booking Meeting Logistics
              </h3>
              <InfoRows
                rows={[
                  { label: "Service Type", value: booking.service },
                  { label: "Scheduled Date", value: booking.scheduledDate },
                  { label: "Meeting Time Slot", value: booking.timeSlot },
                  {
                    label: "Meeting Location",
                    value: booking.location,
                    valueClassName:
                      "text-[13px] font-semibold leading-none tracking-normal text-indigo-600",
                  },
                ]}
              />
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-normal leading-none tracking-normal text-slate-500">
                  Client Special Notes
                </span>
                <p className="text-[13px] font-normal leading-4.5 tracking-normal text-slate-600">
                  &quot;{booking.notes}&quot;
                </p>
              </div>
            </article>

            <article className="flex min-h-30.75 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
              <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
                Customer Overview
              </h3>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar
                    size="md"
                    src={booking.image}
                    alt={booking.name}
                    className="size-12 text-[18px]"
                  >
                    {booking.initials}
                  </Avatar>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate text-[14px] font-semibold leading-4.5 tracking-normal text-slate-900">
                      {booking.name}
                    </p>
                    <p className="truncate text-[12px] font-normal leading-4 tracking-normal text-slate-500">
                      {booking.email}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-[12px] font-normal leading-none tracking-normal text-slate-600">
                  {previousCount} Total Bookings Completed
                </p>
              </div>
            </article>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <article className="flex min-h-38 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
              <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
                Payment Ledger Breakdown
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] font-normal leading-none tracking-normal text-slate-500">
                    Billing Amount
                  </span>
                  <span className="text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                    {booking.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] font-normal leading-none tracking-normal text-slate-500">
                    Payment Status
                  </span>
                  {booking.paid ? (
                    <StatusBadge status="completed">Paid</StatusBadge>
                  ) : (
                    <StatusBadge status="pending" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] font-normal leading-none tracking-normal text-slate-500">
                    Invoice Link
                  </span>
                  <span className="text-[13px] font-semibold leading-none tracking-normal text-indigo-600">
                    {booking.invoice}
                  </span>
                </div>
              </div>
            </article>

            <article className="flex flex-col gap-5 rounded-lg border border-solid border-slate-200 bg-white p-5">
              <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
                Booking Lifecycle Logs
              </h3>
              <div className="flex flex-col gap-5">
                {history.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success-light text-success">
                      <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
                    </span>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="text-[13px] font-semibold leading-4.5 tracking-normal text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-[12px] font-normal leading-4 tracking-normal text-slate-600">
                        {item.detail}
                      </p>
                      <p className="text-[11px] font-normal leading-3.5 tracking-normal text-slate-500">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
      <BookingDetailMobile
        booking={booking}
        previousCount={previousCount}
        onReschedule={() => {
          const next = rescheduleBooking(booking.id);
          if (!next) {
            return;
          }
          notify({
            severity: "info",
            title: "Booking rescheduled",
            description: `${next.id} is now scheduled for ${next.dateLabel}.`,
          });
        }}
        onCancel={() => {
          cancelBooking(booking.id);
          notify({
            severity: "warning",
            title: "Booking cancelled",
            description: `${booking.id} was cancelled.`,
          });
        }}
      />
      <MobileTabBar />
    </main>
  );
}

export { BookingDetailScreen };
