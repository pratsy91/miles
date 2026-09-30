import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataEmpty, DataError, ListPagination, ListSkeleton } from "@/components/ui/data-state";
import type { StoredUser } from "@/lib/users-store";
import { Filter, Pencil, Search, Trash2 } from "lucide-react";
import Link from "next/link";

const ROLE_LABELS: Record<StoredUser["role"], string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

function UsersMobile({
  users,
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
  onAddUser,
  onDeleteUser,
}: {
  users: StoredUser[];
  total: number;
  page: number;
  pageSize: number;
  onPrevious: () => void;
  onNext: () => void;
  stats: { total: string; active: string; newest: string };
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  onAddUser: () => void;
  onDeleteUser: (id: string) => void;
}) {
  const mobileStats = [
    { label: "Total Users", value: stats.total },
    { label: "Active", value: stats.active },
    { label: "New This Mo", value: stats.newest },
  ];
  return (
    <div className="flex flex-col gap-4 md:hidden">
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-[18px] font-bold leading-none tracking-normal text-slate-900">
          User Management
        </h2>
        <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
          Manage registered application users
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
            placeholder="Search users..."
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-none tracking-normal text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
        <button
          type="button"
          aria-label="Filter users"
          className="box-border flex size-9 shrink-0 items-center justify-center rounded-lg border border-solid border-slate-200 bg-white text-slate-600"
        >
          <Filter aria-hidden className="size-4" />
        </button>
      </div>

      <section className="grid grid-cols-3 gap-2">
        {mobileStats.map((stat) => (
          <article
            key={stat.label}
            className="box-border flex h-13.25 min-w-0 flex-col gap-1 rounded-md border border-solid border-slate-200 bg-white p-2.5"
          >
            <p className="font-sans text-[10px] font-normal leading-none tracking-normal text-slate-500">
              {stat.label}
            </p>
            <p className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
              {stat.value}
            </p>
          </article>
        ))}
      </section>

      <Button
        variant="primary"
        size="md"
        onClick={onAddUser}
        className="box-border h-10! w-full gap-2 rounded-lg p-3! font-sans text-[13px]! font-semibold! leading-none tracking-normal"
      >
        Add New User
      </Button>

      <div className="flex flex-col gap-3">
        {loading ? <ListSkeleton variant="cards" rows={4} /> : null}
        {error ? <DataError message={error} onRetry={onRetry} /> : null}
        {!loading && !error && total === 0 ? (
          <DataEmpty title="No users" description="No users match these filters." />
        ) : null}
        {!loading && !error
          ? users.map((user) => (
          <article
            key={user.id}
            className="relative box-border flex h-25.75 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-3"
          >
            <Link
              href={`/users/${user.id}`}
              aria-label={`View ${user.name}`}
              className="absolute inset-0 rounded-lg"
            />
            <div className="flex items-center">
              <Avatar
                size="sm"
                src={user.image}
                alt={user.name}
                className="size-9 rounded-[18px] text-[13px]"
              >
                {user.initials}
              </Avatar>
              <div className="ml-2.5 min-w-0 flex-1">
                <p className="truncate font-sans text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                  {user.name}
                </p>
                <p className="mt-0.5 truncate font-sans text-[11px] font-normal leading-none tracking-normal text-slate-500">
                  {user.email}
                </p>
              </div>
              <Link
                href={`/users/${user.id}`}
                aria-label={`Edit ${user.name}`}
                className="relative z-10 ml-2.5 box-border flex size-6 shrink-0 items-center justify-center rounded-xl border border-solid border-slate-200 text-slate-600"
              >
                <Pencil aria-hidden className="size-3.5" />
              </Link>
              <button
                type="button"
                aria-label={`Delete ${user.name}`}
                onClick={() => onDeleteUser(user.id)}
                className="relative z-10 ml-2 box-border flex size-6 shrink-0 items-center justify-center rounded-xl border border-solid border-slate-200 text-error-dark"
              >
                <Trash2 aria-hidden className="size-3.5" />
              </button>
            </div>
            <div className="h-0 w-full border-t border-solid border-slate-200" />
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-5.25 items-center rounded-xl px-2 text-[11px] font-semibold leading-none tracking-normal ${user.role === "viewer" ? "bg-slate-100 text-slate-600" : "bg-info-light text-info-dark"}`}
              >
                {ROLE_LABELS[user.role]}
              </span>
              <StatusBadge status={user.status} />
              <span className="ml-auto font-sans text-[10px] font-normal leading-none tracking-normal text-slate-400">
                Active {user.lastActive}
              </span>
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

export { UsersMobile };
