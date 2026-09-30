import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StoredBooking } from "@/lib/bookings-store";

function logTime(occurredAt: number, hoursEarlier: number) {
  return new Date(occurredAt - hoursEarlier * 60 * 60 * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function BookingDetailMobile({
  booking,
  previousCount,
  onReschedule,
  onCancel,
}: {
  booking: StoredBooking;
  previousCount: number;
  onReschedule: () => void;
  onCancel: () => void;
}) {
  const cancelled = booking.status === "cancelled";
  const log = [
    {
      title: "Automated Reminder Sent",
      detail: "SMS and Email dispatch verified.",
      time: logTime(booking.occurredAt, 5),
      dotClassName: "bg-indigo-600",
    },
    {
      title: cancelled ? "Booking Cancelled" : "Booking Confirmed",
      detail: cancelled
        ? "Session cancelled by an administrator."
        : "Consultant accepted session invitation.",
      time: logTime(booking.occurredAt, 24),
      dotClassName: cancelled ? "bg-error" : "bg-success",
    },
    {
      title: "Booking Created",
      detail: `Checkout verified via ${booking.invoice}.`,
      time: logTime(booking.occurredAt, 25),
      dotClassName: "bg-indigo-600",
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:hidden">
      <article className="box-border flex min-h-31.25 w-full flex-col items-center gap-3 rounded-lg border border-solid border-slate-200 bg-white p-5">
        <p className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
          Booking {booking.id}
        </p>
        <h2 className="font-sans text-[32px] font-extrabold leading-none tracking-normal text-slate-900">
          {booking.service}
        </h2>
        <div className="flex items-center gap-2">
          <StatusBadge status={booking.status} />
          {booking.premium ? (
            <span className="inline-flex h-5.25 items-center rounded-xl bg-indigo-50 px-2 text-[11px] font-semibold leading-none tracking-normal text-indigo-600">
              Premium
            </span>
          ) : null}
        </div>
      </article>

      <div className="flex w-full gap-3">
        <Button
          variant="primary"
          size="md"
          disabled={cancelled}
          onClick={onReschedule}
          className="h-11 flex-1 rounded-lg px-3 text-[14px] font-semibold leading-none tracking-normal"
        >
          Reschedule
        </Button>
        <Button
          variant="ghost"
          size="md"
          disabled={cancelled}
          onClick={onCancel}
          className="h-11 flex-1 rounded-lg border border-error bg-white px-3 text-[14px] font-semibold leading-none tracking-normal text-error hover:bg-white"
        >
          {cancelled ? "Cancelled" : "Cancel Booking"}
        </Button>
      </div>

      <article className="box-border flex min-h-70.75 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Booking Details
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "Service", value: booking.service },
            { label: "Date", value: booking.dateLabel },
            { label: "Time", value: booking.timeSlot.replace(" (EST)", "") },
            { label: "Duration", value: booking.duration },
            { label: "Location", value: booking.location },
          ].map((row) => (
            <div
              key={row.label}
              className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5"
            >
              <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
                {row.label}
              </span>
              <span className="text-right font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
                {row.value}
              </span>
            </div>
          ))}
          <div className="box-border flex w-full items-start justify-between border-b border-solid border-slate-200 pb-2.5">
            <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
              Customer Notes
            </span>
            <span className="line-clamp-2 min-w-0 flex-1 text-right font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
              {booking.notes}
            </span>
          </div>
        </div>
      </article>

      <article className="box-border flex h-47.75 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Customer Profile
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "Name", value: booking.name, className: "text-slate-900" },
            { label: "Email", value: booking.email, className: "text-slate-900" },
            { label: "Phone", value: booking.phone, className: "text-slate-900" },
            {
              label: "Previous Bookings",
              value: `${previousCount} bookings completed`,
              className: "text-indigo-600",
            },
          ].map((row) => (
            <div
              key={row.label}
              className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5"
            >
              <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
                {row.label}
              </span>
              <span
                className={`text-right font-sans text-[13px] font-medium leading-none tracking-normal ${row.className}`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="box-border flex h-47.75 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Payment Information
        </h3>
        <div className="flex flex-col gap-3">
          <div className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5">
            <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
              Amount
            </span>
            <span className="text-right font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
              {booking.amount}
            </span>
          </div>
          <div className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5">
            <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
              Payment Status
            </span>
            <span
              className={`text-right font-sans text-[13px] font-medium leading-none tracking-normal ${booking.paid ? "text-success" : "text-slate-500"}`}
            >
              {booking.paid ? "Paid" : "Pending"}
            </span>
          </div>
          <div className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5">
            <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
              Method
            </span>
            <span className="text-right font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
              {booking.method}
            </span>
          </div>
          <div className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5">
            <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
              Invoice
            </span>
            <span className="text-right font-sans text-[13px] font-medium leading-none tracking-normal text-indigo-600">
              {booking.invoice}
            </span>
          </div>
        </div>
      </article>

      <article className="box-border flex h-58.25 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Booking Log
        </h3>
        <div className="flex flex-col gap-3">
          {log.map((item, index) => (
            <div key={item.title} className="relative flex gap-3">
              {index < log.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-3 -bottom-3 left-0.75 w-px bg-indigo-200"
                />
              ) : null}
              <span
                aria-hidden
                className={`relative z-10 mt-1 size-2 shrink-0 rounded-full ${item.dotClassName}`}
              />
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="font-sans text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                  {item.title}
                </p>
                <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
                  {item.detail}
                </p>
                <p className="font-sans text-[11px] font-normal leading-none tracking-normal text-slate-400">
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export { BookingDetailMobile };
