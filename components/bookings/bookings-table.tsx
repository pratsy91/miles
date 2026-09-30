import { StatusBadge } from "@/components/ui/badge";
import { DataEmpty, ListPagination } from "@/components/ui/data-state";
import { Avatar } from "@/components/ui/avatar";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HEADER_CELL =
  "text-[12px] font-semibold leading-none tracking-normal text-slate-500 uppercase";

type BookingStatus = "confirmed" | "completed" | "pending" | "cancelled";

type BookingRow = {
  id: string;
  name: string;
  initials: string;
  image?: string;
  service: string;
  dateTime: string;
  duration: string;
  status: BookingStatus;
  amount: string;
};

function BookingsTableRow({ booking }: { booking: BookingRow }) {
  const router = useRouter();

  return (
    <div
      role="row"
      onClick={() => router.push(`/bookings/${booking.id.slice(1)}`)}
      className="bookings-table-grid grid h-14 cursor-pointer items-center gap-4 border-b border-slate-200 px-3"
    >
      <span className="text-[13px] font-semibold leading-none tracking-normal text-slate-900">
        {booking.id}
      </span>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar size="sm" src={booking.image} alt={booking.name}>
          {booking.initials}
        </Avatar>
        <p className="truncate text-[13px] font-semibold leading-none tracking-normal text-slate-900">
          {booking.name}
        </p>
      </div>
      <span className="truncate text-[13px] font-normal leading-none tracking-normal text-slate-900">
        {booking.service}
      </span>
      <span className="text-[13px] font-normal leading-none tracking-normal text-slate-600">
        {booking.dateTime}
      </span>
      <span className="text-[13px] font-normal leading-none tracking-normal text-slate-600">
        {booking.duration}
      </span>
      <StatusBadge status={booking.status} />
      <span className="text-[13px] font-semibold leading-none tracking-normal text-slate-900">
        {booking.amount}
      </span>
      <div className="flex items-center justify-start gap-3">
        <Link
          href={`/bookings/${booking.id.slice(1)}`}
          aria-label={`View ${booking.id}`}
          className="text-slate-600"
        >
          <Eye aria-hidden className="size-4" />
        </Link>
        <Link
          href={`/bookings/${booking.id.slice(1)}`}
          aria-label={`Edit ${booking.id}`}
          className="text-slate-600"
        >
          <Pencil aria-hidden className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function BookingsTable({
  bookings,
  page,
  pageSize,
  total,
  onPrevious,
  onNext,
}: {
  bookings: BookingRow[];
  page: number;
  pageSize: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <section className="flex w-full flex-col rounded-lg border border-solid border-slate-200 bg-white p-5">
      <div className="w-full overflow-x-auto">
        <div className="w-full min-w-min min-[1200px]:min-w-277">
          <div
            role="row"
            className="bookings-table-grid grid h-10 items-center gap-4 rounded-md bg-slate-50 px-3"
          >
            <span role="columnheader" className={HEADER_CELL}>
              Booking ID
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Customer
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Service
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Date & Time
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Duration
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Status
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Amount
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Actions
            </span>
          </div>
          {bookings.length === 0 ? (
            <DataEmpty
              title="No bookings"
              description="No bookings match these filters."
            />
          ) : (
            bookings.map((booking) => <BookingsTableRow key={booking.id} booking={booking} />)
          )}
        </div>
      </div>
      <ListPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </section>
  );
}

export { BookingsTable };
