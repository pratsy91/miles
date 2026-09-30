"use client";

import { Avatar } from "@/components/ui/avatar";
import { DataEmpty, DataError, DetailSkeleton } from "@/components/ui/data-state";
import { useAlerts } from "@/components/ui/alerts";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProfileDraft } from "@/components/users/user-detail-columns";
import { useUsers } from "@/hooks/use-users";
import { updateUser, type StoredUser } from "@/lib/users-store";
import { useState } from "react";

const ACTIVITY = [
  {
    title: "Logged in from Chrome / macOS",
    detail: "IP: 192.168.1.45",
    time: "10 mins ago",
  },
  {
    title: "Updated security settings",
    detail: "Changed master recovery email",
    time: "2 hours ago",
  },
  {
    title: "Approved Transaction #TXN-7823",
    detail: "Value $245.00 approved manually",
    time: "1 day ago",
  },
];

const TRANSACTIONS = [
  { id: "#TXN-7823", date: "Oct 1, 2024", amount: "$245.00" },
  { id: "#TXN-6912", date: "Sep 14, 2024", amount: "$120.00" },
];

const ROLE_LABELS: Record<StoredUser["role"], string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

function draftFrom(user: StoredUser): ProfileDraft {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    birthDate: user.birthDate,
    address: user.address,
  };
}

function UserDetailMobile({ id }: { id: string }) {
  const { users, loading, error, reload } = useUsers();
  const notify = useAlerts();
  const user = users?.find((item) => item.id === id) ?? null;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft | null>(null);

  if (loading) {
    return (
      <div className="md:hidden">
        <DetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:hidden">
        <DataError message={error} onRetry={reload} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="md:hidden">
        <DataEmpty title="User not found" description="This user is not in the directory." />
      </div>
    );
  }

  const currentDraft = draft ?? draftFrom(user);
  const display = editing ? currentDraft : user;
  const role = ROLE_LABELS[user.role];

  function save() {
    updateUser(id, currentDraft);
    setEditing(false);
    setDraft(null);
    notify({
      severity: "success",
      title: "Profile updated",
      description: `${currentDraft.name} was saved.`,
    });
  }

  return (
    <div className="flex flex-col gap-4 md:hidden">
      <article className="box-border flex h-49.75 w-full flex-col items-center rounded-lg border border-solid border-slate-200 bg-white p-5">
        <Avatar
          size="lg"
          src={user.image}
          alt={display.name}
          className="size-18 rounded-[36px] text-[24px]"
        >
          {user.initials}
        </Avatar>
        <h2 className="mt-3 font-sans text-[18px] font-bold leading-none tracking-normal text-slate-900">
          {display.name}
        </h2>
        <p className="mt-1 font-sans text-[13px] font-normal leading-none tracking-normal text-slate-500">
          {display.email}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex h-5.25 items-center rounded-xl px-2 text-[11px] font-semibold leading-none tracking-normal ${user.role === "viewer" ? "bg-slate-100 text-slate-600" : "bg-info-light text-info-dark"}`}
          >
            {role}
          </span>
          <StatusBadge status={user.status} />
        </div>
      </article>

      <div className="flex w-full gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            if (editing) {
              save();
              return;
            }
            setDraft(draftFrom(user));
            setEditing(true);
          }}
          className="h-11 flex-1 rounded-lg px-3 font-sans text-[14px] font-semibold leading-none tracking-normal"
        >
          {editing ? "Save" : "Edit Profile"}
        </Button>
        <Button
          variant="ghost"
          size="md"
          disabled={user.status === "suspended"}
          onClick={() => {
            updateUser(id, { status: "suspended" });
            notify({
              severity: "warning",
              title: "User suspended",
              description: `${user.name} was suspended.`,
            });
          }}
          className="h-11 flex-1 rounded-lg border border-error bg-white px-3 font-sans text-[14px] font-semibold leading-none tracking-normal text-error hover:bg-white"
        >
          {user.status === "suspended" ? "Suspended" : "Suspend User"}
        </Button>
      </div>

      <article className="box-border flex h-57.25 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Personal Information
        </h3>
        {(
          [
            ["Full Name", "name"],
            ["Email", "email"],
            ["Phone", "phone"],
            ["Date of Birth", "birthDate"],
            ["Address", "address"],
          ] as const
        ).map(([label, field]) => (
          <div
            key={label}
            className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5"
          >
            <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
              {label}
            </span>
            {editing ? (
              <input
                value={currentDraft[field]}
                onChange={(event) =>
                  setDraft({ ...currentDraft, [field]: event.target.value })
                }
                className="h-7 w-full max-w-45 rounded border border-slate-200 px-2 text-right font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900 outline-none"
              />
            ) : (
              <span className="text-right font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
                {display[field]}
              </span>
            )}
          </div>
        ))}
      </article>

      <article className="box-border flex h-57.25 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Account Details
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "User ID", value: user.displayId },
            { label: "Joined Date", value: user.joinDate },
            { label: "Last Login", value: user.lastActive },
            { label: "Role", value: role },
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
          <div className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5">
            <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
              2FA Status
            </span>
            <span
              className={`text-right font-sans text-[13px] font-medium leading-none tracking-normal ${user.twoFactor ? "text-success" : "text-slate-500"}`}
            >
              {user.twoFactor ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </article>

      <article className="box-border flex h-58.25 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Recent Activity
        </h3>
        <div className="flex flex-col gap-3">
          {ACTIVITY.map((item, index) => (
            <div key={item.title} className="relative flex gap-3">
              {index < ACTIVITY.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-3 -bottom-3 left-0.75 w-px bg-indigo-200"
                />
              ) : null}
              <span
                aria-hidden
                className="relative z-10 mt-1 size-2 shrink-0 rounded-full bg-indigo-600"
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

      <article className="box-border flex h-36.75 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
        <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
          Recent Transactions
        </h3>
        <div className="flex flex-col gap-3">
          {TRANSACTIONS.map((transaction) => (
            <div
              key={transaction.id}
              className="box-border flex h-9.75 w-full items-center justify-between border-b border-solid border-slate-200 pb-2"
            >
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="font-sans text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                  {transaction.id}
                </p>
                <p className="font-sans text-[11px] font-normal leading-none tracking-normal text-slate-500">
                  {transaction.date}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-sans text-[13px] font-bold leading-none tracking-normal text-slate-900">
                  {transaction.amount}
                </span>
                <StatusBadge status="completed">Success</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export { UserDetailMobile };
