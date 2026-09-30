import { StatusBadge } from "@/components/ui/badge";
import type { StoredUser } from "@/lib/users-store";
import type { ReactNode } from "react";

type ProfileDraft = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
};

type InfoRow = {
  label: string;
  value?: string;
  valueClassName?: string;
  badge?: string;
  prominent?: boolean;
  field?: keyof ProfileDraft;
};

const ACTIVITY = [
  {
    title: "Created booking #BKG-2341",
    detail: "Strategy development session",
    time: "2 hours ago",
  },
  {
    title: "Changed user password",
    detail: "Initiated self-service reset",
    time: "Yesterday, 16:21",
  },
  {
    title: "Logged in from new device",
    detail: "MacOS Chrome, Brooklyn, NY",
    time: "Sep 28, 2024",
  },
  {
    title: "Completed transaction #TXN-7823",
    detail: "Direct invoice payment received",
    time: "Sep 27, 2024",
  },
  {
    title: "Updated profile photo",
    detail: "Refreshed corporate portrait",
    time: "Sep 15, 2024",
  },
];

const CARD =
  "flex flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5";

const CARD_TITLE =
  "text-[16px] font-bold leading-none tracking-normal text-slate-900";

function InfoRows({
  rows,
  editing,
  onChange,
}: {
  rows: InfoRow[];
  editing?: boolean;
  onChange?: (field: keyof ProfileDraft, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div
          key={row.label}
          className={`flex items-center justify-between gap-4 border-b border-slate-200 pb-2 ${row.prominent ? "" : "min-h-6"}`}
        >
          <span
            className={
              row.prominent
                ? "shrink-0 text-[14px] font-bold leading-none tracking-normal text-slate-900"
                : "shrink-0 text-[13px] font-normal leading-none tracking-normal text-slate-500"
            }
          >
            {row.label}
          </span>
          {row.badge ? (
            <span className="inline-flex h-4.25 items-center rounded-sm bg-success-light px-1.5 py-0.5 text-[11px] font-bold leading-none tracking-normal text-success-dark">
              {row.badge}
            </span>
          ) : editing && row.field && onChange ? (
            <input
              value={row.value ?? ""}
              onChange={(event) =>
                onChange(row.field as keyof ProfileDraft, event.target.value)
              }
              className="h-7 w-full max-w-70 rounded border border-slate-200 px-2 text-right text-[13px] font-semibold leading-none tracking-normal text-slate-900 outline-none"
            />
          ) : (
            <span
              className={
                row.prominent
                  ? "text-[20px] font-bold leading-none tracking-normal text-indigo-600"
                  : (row.valueClassName ??
                    "truncate text-right text-[13px] font-semibold leading-none tracking-normal text-slate-900")
              }
            >
              {row.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function UserDetailColumns({
  user,
  editing,
  draft,
  onDraftChange,
}: {
  user: StoredUser;
  editing: boolean;
  draft: ProfileDraft;
  onDraftChange: (field: keyof ProfileDraft, value: string) => void;
}) {
  const source = editing ? draft : user;
  const personal: InfoRow[] = [
    { label: "Full Name", value: source.name, field: "name" },
    { label: "Email Address", value: source.email, field: "email" },
    { label: "Phone Number", value: source.phone, field: "phone" },
    { label: "Date of Birth", value: source.birthDate, field: "birthDate" },
    { label: "Mailing Address", value: source.address, field: "address" },
  ];

  const account: InfoRow[] = [
    { label: "User ID", value: user.displayId },
    { label: "Joined Date", value: user.joinDate },
    { label: "Last Login Activity", value: user.lastActive },
    user.twoFactor
      ? { label: "Two-Factor Security", badge: "Enabled" }
      : { label: "Two-Factor Security", value: "Disabled" },
  ];

  return (
    <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,400px)]">
      <div className="flex min-w-0 flex-col gap-4">
        <article className={CARD}>
          <h3 className={CARD_TITLE}>Personal Information</h3>
          <InfoRows
            rows={personal}
            editing={editing}
            onChange={onDraftChange}
          />
        </article>
        <article className={CARD}>
          <h3 className={CARD_TITLE}>Account Information</h3>
          <InfoRows rows={account} />
        </article>
      </div>

      <article className={`${CARD} min-h-94.75`}>
        <h3 className={CARD_TITLE}>Recent Activity Log</h3>
        <div className="flex flex-col gap-4">
          {ACTIVITY.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1.25 size-2 shrink-0 rounded-full bg-indigo-600"
              />
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
    </section>
  );
}

export { UserDetailColumns, UserRecentTables, InfoRows };
export type { ProfileDraft };

const RECENT_GRID =
  "grid grid-cols-[90px_90px_110px_minmax(100px,1fr)] items-center gap-4 px-3";

const RECENT_HEADER =
  "text-[12px] font-semibold leading-none tracking-normal text-slate-500 uppercase";

const RECENT_STRONG =
  "text-[13px] font-semibold leading-none tracking-normal text-slate-900";

const RECENT_DATE =
  "text-[13px] font-normal leading-none tracking-normal text-slate-500";

function RecentTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: {
    id: string;
    middle: string;
    middleClass: string;
    status: ReactNode;
    date: string;
  }[];
}) {
  return (
    <article className="flex min-h-50 min-w-0 flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-5">
      <h3 className={CARD_TITLE}>{title}</h3>
      <div>
        <div className={`${RECENT_GRID} h-9.75 rounded-md bg-slate-50`}>
          {headers.map((header) => (
            <span key={header} className={RECENT_HEADER}>
              {header}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div
            key={row.id}
            className={`${RECENT_GRID} h-11.25 border-b border-slate-200`}
          >
            <span className={RECENT_STRONG}>{row.id}</span>
            <span className={row.middleClass}>{row.middle}</span>
            {row.status}
            <span className={RECENT_DATE}>{row.date}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function UserRecentTables({ name }: { name: string }) {
  const firstName = name.split(" ")[0] ?? name;

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <RecentTable
        title={`${firstName}'s Recent Transactions`}
        headers={["ID", "Amount", "Status", "Date"]}
        rows={[
          {
            id: "#TXN-7823",
            middle: "$245.00",
            middleClass: RECENT_STRONG,
            status: <StatusBadge status="completed">Paid</StatusBadge>,
            date: "Sep 27, 2024",
          },
          {
            id: "#TXN-7102",
            middle: "$120.00",
            middleClass: RECENT_STRONG,
            status: <StatusBadge status="info">Completed</StatusBadge>,
            date: "Aug 15, 2024",
          },
        ]}
      />
      <RecentTable
        title={`${firstName}'s Recent Bookings`}
        headers={["ID", "Service", "Status", "Date & Time"]}
        rows={[
          {
            id: "#BKG-2341",
            middle: "Consultation",
            middleClass:
              "text-[13px] font-normal leading-none tracking-normal text-slate-900",
            status: <StatusBadge status="confirmed" />,
            date: "Oct 15, 14:00",
          },
          {
            id: "#BKG-1980",
            middle: "Executive Coaching",
            middleClass:
              "text-[13px] font-normal leading-none tracking-normal text-slate-900",
            status: <StatusBadge status="info">Completed</StatusBadge>,
            date: "Sep 01, 10:30",
          },
        ]}
      />
    </section>
  );
}
