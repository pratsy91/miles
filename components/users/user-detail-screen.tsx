"use client";

import {
  UserDetailColumns,
  UserRecentTables,
  type ProfileDraft,
} from "@/components/users/user-detail-columns";
import { UserDetailMobile } from "@/components/users/user-detail-mobile";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Avatar } from "@/components/ui/avatar";
import { DataEmpty, DataError, DetailSkeleton } from "@/components/ui/data-state";
import { useAlerts } from "@/components/ui/alerts";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/use-users";
import { updateUser, type StoredUser } from "@/lib/users-store";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function draftFrom(user: StoredUser): ProfileDraft {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    birthDate: user.birthDate,
    address: user.address,
  };
}

function UserDetailScreen({ id }: { id: string }) {
  const { users, loading, error, reload } = useUsers();
  const notify = useAlerts();
  const user = users?.find((item) => item.id === id) ?? null;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft | null>(null);

  if (loading) {
    return (
      <main
        data-mobile-outline=""
        className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20"
      >
        <div className="hidden md:block">
          <DetailSkeleton />
        </div>
        <UserDetailMobile id={id} />
        <MobileTabBar />
      </main>
    );
  }

  if (error || !user) {
    return (
      <main
        data-mobile-outline=""
        className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20"
      >
        <div className="hidden md:block">
          {error ? (
            <DataError message={error} onRetry={reload} />
          ) : (
            <DataEmpty title="User not found" description="This user is not in the directory." />
          )}
        </div>
        <UserDetailMobile id={id} />
        <MobileTabBar />
      </main>
    );
  }

  const currentDraft = draft ?? draftFrom(user);

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
    <main
      data-slot="user-detail-page"
      data-mobile-outline=""
      className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20"
    >
      <div className="hidden flex-col gap-6 md:flex">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link
            href="/users"
            className="text-[13px] font-medium leading-none tracking-normal text-slate-500 no-underline"
          >
            Users
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
            {user.name}
          </span>
        </nav>

        <section className="flex min-h-30 w-full flex-col justify-between gap-4 rounded-lg border border-solid border-slate-200 bg-white p-6 sm:h-30 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-5">
            <Avatar
              size="lg"
              src={user.image}
              alt={user.name}
              className="size-18 text-[27px]"
            >
              {user.initials}
            </Avatar>
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[22px] font-bold leading-none tracking-normal text-slate-900">
                  {user.name}
                </h2>
                <StatusBadge status={user.status} />
                <StatusBadge status="confirmed" />
              </div>
              <p className="text-[14px] font-normal leading-none tracking-normal text-slate-500">
                {user.email}
                <span aria-hidden className="px-1.5">
                  •
                </span>
                Joined {user.joinDate}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                if (editing) {
                  save();
                  return;
                }
                setDraft(draftFrom(user));
                setEditing(true);
              }}
              className="h-9.25 w-32 gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[14px] font-semibold leading-none tracking-normal text-slate-600"
            >
              <Pencil aria-hidden className="size-4" />
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
              className="h-9.25 w-31.75 rounded-lg bg-error-light px-4 text-[14px] font-semibold leading-none tracking-normal text-error-dark hover:bg-error-light"
            >
              {user.status === "suspended" ? "Suspended" : "Suspend User"}
            </Button>
          </div>
        </section>

        <UserDetailColumns
          user={user}
          editing={editing}
          draft={currentDraft}
          onDraftChange={(field, value) =>
            setDraft({ ...currentDraft, [field]: value })
          }
        />
        <UserRecentTables name={user.name} />
      </div>
      <UserDetailMobile id={id} />
      <MobileTabBar />
    </main>
  );
}

export { UserDetailScreen };
