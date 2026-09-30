"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAlerts } from "@/components/ui/alerts";
import { addBooking } from "@/lib/bookings-store";
import { useUsers } from "@/hooks/use-users";
import { useEffect, useState, type FormEvent } from "react";

const DURATIONS = [60, 90, 120] as const;

function formatBookedAt(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function AddBookingDialog({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: (id: string) => void;
}) {
  const { users } = useUsers();
  const notify = useAlerts();
  const [service, setService] = useState("");
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<(typeof DURATIONS)[number]>(60);
  const [bookedAt, setBookedAt] = useState(() => new Date());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (open) {
      setBookedAt(new Date());
    }
  }, [open]);

  useEffect(() => {
    if (!userId && users && users.length > 0) {
      setUserId(users[0].id);
    }
  }, [userId, users]);

  const selectedUser =
    (users ?? []).find((item) => String(item.id) === String(userId)) ?? users?.[0];

  if (!open) {
    return null;
  }

  function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const trimmedService = service.trim();
    const amountValue = Number(amount);
    const customer = selectedUser;
    if (!trimmedService || !customer) {
      setError("Service and customer are required.");
      return;
    }
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    const booking = addBooking({
      user: customer,
      userId: customer.id,
      service: trimmedService,
      amountValue,
      durationMinutes,
      start: bookedAt,
    });
    if (!booking) {
      setError("Could not create the booking.");
      return;
    }

    notify({
      severity: "success",
      title: "Booking added",
      description: `${booking.service} for ${booking.name} was scheduled.`,
    });

    setService("");
    setAmount("");
    setDurationMinutes(60);
    setError(null);
    onAdded(booking.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        onSubmit={submit}
        className="flex w-full max-w-105 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5"
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-sans text-[16px] font-bold leading-none tracking-normal text-slate-900">
            New Booking
          </h2>
          <p className="font-sans text-[13px] font-normal leading-none tracking-normal text-slate-500">
            Add a booking to the directory.
          </p>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-700">
            Service
          </span>
          <Input value={service} onValueChange={setService} placeholder="Strategy consultation" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-700">
            Customer
          </span>
          <select
            value={selectedUser?.id ?? ""}
            onChange={(event) => setUserId(event.target.value)}
            className="box-border h-9.75 w-full rounded-lg border border-solid border-slate-300 bg-white px-3.5 text-[14px] leading-none tracking-normal text-slate-900 outline-none focus:border-2 focus:border-indigo-600"
          >
            {(users ?? []).map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-700">
            Amount
          </span>
          <Input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onValueChange={setAmount}
            placeholder="120"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-700">
              Duration
            </span>
            <select
              value={durationMinutes}
              onChange={(event) =>
                setDurationMinutes(Number(event.target.value) as (typeof DURATIONS)[number])
              }
              className="box-border h-9.75 w-full rounded-lg border border-solid border-slate-300 bg-white px-3.5 text-[14px] leading-none tracking-normal text-slate-900 outline-none focus:border-2 focus:border-indigo-600"
            >
              {DURATIONS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes / 60} hr
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-700">
              Date
            </span>
            <Input value={formatBookedAt(bookedAt)} readOnly disabled />
          </label>
        </div>
        {error ? (
          <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-error">
            {error}
          </p>
        ) : null}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={
              !service.trim() ||
              !selectedUser ||
              !Number.isFinite(Number(amount)) ||
              Number(amount) <= 0
            }
            onClick={() => submit()}
          >
            New Booking
          </Button>
        </div>
      </form>
    </div>
  );
}

export { AddBookingDialog };
