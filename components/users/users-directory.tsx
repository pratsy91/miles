"use client";

import { DirectoryHeader } from "@/components/layout/directory-header";
import { FiltersBar } from "@/components/layout/filters-bar";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { AddUserDialog } from "@/components/users/add-user-dialog";
import { DeleteUserDialog } from "@/components/users/delete-user-dialog";
import { DataError, ListSkeleton } from "@/components/ui/data-state";
import { useAlerts } from "@/components/ui/alerts";
import { UsersMobile } from "@/components/users/users-mobile";
import { UsersSelectionBar } from "@/components/users/users-selection-bar";
import { UsersStats } from "@/components/users/users-stats";
import { UsersTable } from "@/components/users/users-table";
import { useUsers } from "@/hooks/use-users";
import {
  deleteUser,
  updateUsers,
  type StoredUser,
  type UserRole,
} from "@/lib/users-store";
import { formatCount, monthStart } from "@/lib/format";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 8;

function matchesQuery(user: StoredUser, query: string) {
  const value = query.trim().toLowerCase();
  if (!value) {
    return true;
  }

  return (
    user.name.toLowerCase().includes(value) ||
    user.email.toLowerCase().includes(value)
  );
}

function UsersDirectory() {
  const { users, loading, error, reload } = useUsers();
  const notify = useAlerts();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Date Joined");
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addingUser, setAddingUser] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const next = (users ?? []).filter((user) => {
      const matchesRole = role === "All" || user.role === role.toLowerCase();
      const matchesStatus =
        status === "All" || user.status === status.toLowerCase();
      return matchesQuery(user, query) && matchesRole && matchesStatus;
    });

    next.sort((left, right) =>
      sort === "Name"
        ? left.name.localeCompare(right.name)
        : right.joinTime - left.joinTime,
    );

    return next;
  }, [users, query, role, status, sort]);

  useEffect(() => {
    setPage(0);
  }, [query, role, status, sort]);

  useEffect(() => {
    const lastPage = Math.max(0, Math.ceil(filtered.length / PAGE_SIZE) - 1);
    setPage((current) => (current > lastPage ? lastPage : current));
  }, [filtered.length]);

  const monthStartTime = monthStart();
  const userStats = {
    total: users == null ? "—" : formatCount(users.length),
    active:
      users == null
        ? "—"
        : formatCount(users.filter((user) => user.status === "active").length),
    newest:
      users == null
        ? "—"
        : formatCount(users.filter((user) => user.joinTime >= monthStartTime).length),
  };

  const pageUsers = filtered.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );
  const pageAllSelected =
    pageUsers.length > 0 &&
    pageUsers.every((user) => selectedIds.includes(user.id));

  function toggleUser(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function togglePage() {
    const pageIds = pageUsers.map((user) => user.id);
    setSelectedIds((current) => {
      const allSelected =
        pageIds.length > 0 && pageIds.every((id) => current.includes(id));
      if (allSelected) {
        return current.filter((id) => !pageIds.includes(id));
      }
      return [...new Set([...current, ...pageIds])];
    });
  }

  function changeRole(nextRole: UserRole) {
    const labels = {
      admin: "Admin",
      editor: "Editor",
      viewer: "Viewer",
    } as const;
    const count = selectedIds.length;
    updateUsers(selectedIds, { role: nextRole });
    setSelectedIds([]);
    notify({
      severity: "info",
      title: "Role updated",
      description: `${count} ${count === 1 ? "user is" : "users are"} now ${labels[nextRole]}.`,
    });
  }

  function suspendAccounts() {
    const count = selectedIds.length;
    updateUsers(selectedIds, { status: "suspended" });
    setSelectedIds([]);
    notify({
      severity: "warning",
      title: "Accounts suspended",
      description: `${count} ${count === 1 ? "user was" : "users were"} suspended.`,
    });
  }

  function confirmDelete() {
    if (!pendingDeleteId) {
      return;
    }

    const name = pendingDeleteName ?? "This user";
    deleteUser(pendingDeleteId);
    setSelectedIds((current) =>
      current.filter((item) => item !== pendingDeleteId),
    );
    setPendingDeleteId(null);
    notify({
      severity: "critical",
      title: "User deleted",
      description: `${name} was removed from the directory.`,
    });
  }

  const pendingDeleteName =
    users?.find((user) => user.id === pendingDeleteId)?.name ?? null;

  return (
    <main
      data-slot="users-page"
      className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20"
    >
      <div className="hidden flex-col gap-6 md:flex">
        <DirectoryHeader
          title="Users Directory"
          subtitle="Manage all registered users in your application"
          actionLabel="Add User"
          onAction={() => setAddingUser(true)}
        />
        <UsersStats
          stats={[
            { label: "Total Users", value: userStats.total },
            { label: "Active Users", value: userStats.active },
            { label: "New This Month", value: userStats.newest },
          ]}
        />
        <FiltersBar
          searchPlaceholder="Search users by name or email..."
          search={query}
          onSearchChange={setQuery}
          filters={[
            {
              label: "Role",
              value: role,
              options: ["All", "Admin", "Editor", "Viewer"],
              onChange: setRole,
            },
            {
              label: "Status",
              value: status,
              options: ["All", "Active", "Inactive", "Suspended"],
              onChange: setStatus,
            },
          ]}
          sort={{
            label: "Sort by:",
            value: sort,
            options: ["Date Joined", "Name"],
            onChange: setSort,
          }}
        />
        {selectedIds.length >= 2 ? (
          <UsersSelectionBar
            count={selectedIds.length}
            onChangeRole={changeRole}
            onSuspend={suspendAccounts}
          />
        ) : null}
        {loading ? (
          <ListSkeleton rows={8} />
        ) : error ? (
          <DataError message={error} onRetry={reload} />
        ) : (
          <UsersTable
            users={pageUsers.map((user) => ({
              ...user,
              selected: selectedIds.includes(user.id),
            }))}
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            pageAllSelected={pageAllSelected}
            onToggleUser={toggleUser}
            onTogglePage={togglePage}
            onDeleteUser={setPendingDeleteId}
            onPrevious={() => setPage((current) => Math.max(0, current - 1))}
            onNext={() =>
              setPage((current) =>
                (current + 1) * PAGE_SIZE >= filtered.length
                  ? current
                  : current + 1,
              )
            }
          />
        )}
      </div>
      <UsersMobile
        users={pageUsers}
        total={filtered.length}
        page={page}
        pageSize={PAGE_SIZE}
        onPrevious={() => setPage((current) => Math.max(0, current - 1))}
        onNext={() =>
          setPage((current) =>
            (current + 1) * PAGE_SIZE >= filtered.length ? current : current + 1,
          )
        }
        stats={userStats}
        loading={loading}
        error={error}
        onRetry={reload}
        query={query}
        onQueryChange={setQuery}
        onAddUser={() => setAddingUser(true)}
        onDeleteUser={setPendingDeleteId}
      />
      <AddUserDialog
        open={addingUser}
        onClose={() => setAddingUser(false)}
        onAdded={() => setPage(0)}
      />
      <DeleteUserDialog
        name={pendingDeleteId ? (pendingDeleteName ?? "this user") : null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
      />
      <MobileTabBar />
    </main>
  );
}

export { UsersDirectory };
