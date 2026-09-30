import { SelectIcon } from "@/components/icons/select-icon";
import { StatusBadge } from "@/components/ui/badge";
import { DataEmpty, ListPagination } from "@/components/ui/data-state";
import { Avatar } from "@/components/ui/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const HEADER_CELL =
  "text-[12px] font-semibold leading-none tracking-normal text-slate-500 uppercase";

const roleBadgeVariants = cva(
  "box-border inline-flex h-[17px] w-[51px] shrink-0 items-center justify-center rounded-[4px] px-[8px] py-[2px] text-[11px] font-semibold leading-none tracking-normal whitespace-nowrap",
  {
    variants: {
      role: {
        admin: "bg-indigo-50 text-indigo-600",
        editor: "bg-info-light text-info-dark",
        viewer: "bg-slate-50 text-slate-600",
      },
    },
  },
);

type UserRole = NonNullable<VariantProps<typeof roleBadgeVariants>["role"]>;
type UserStatus = "active" | "inactive" | "suspended";

type UserRow = {
  id: string;
  name: string;
  email: string;
  initials: string;
  image?: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  lastActive: string;
  selected?: boolean;
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

function UserSelectControl({
  checked,
  label,
  disabled = false,
  onChange,
}: {
  checked: boolean;
  label: string;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center text-indigo-600",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {checked ? (
        <SelectIcon className="size-4" />
      ) : (
        <span className="box-border size-4 rounded-xs border border-solid border-slate-300 bg-white" />
      )}
    </button>
  );
}

function UsersTableRow({
  user,
  onToggle,
  onDelete,
}: {
  user: UserRow;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      role="row"
      aria-selected={Boolean(user.selected)}
      className={cn(
        "users-table-grid grid h-14 items-center gap-4 border-b border-slate-200 px-3",
        user.selected && "bg-indigo-50",
      )}
    >
      <UserSelectControl
        checked={Boolean(user.selected)}
        label={`Select ${user.name}`}
        onChange={() => onToggle(user.id)}
      />
      <div className="flex min-w-0 items-center gap-3">
        <Avatar size="sm" src={user.image} alt={user.name}>
          {user.initials}
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-[13px] font-semibold leading-none tracking-normal text-slate-900">
            {user.name}
          </p>
          <p className="truncate text-[11px] font-normal leading-none tracking-normal text-slate-500">
            {user.email}
          </p>
        </div>
      </div>
      <span className={roleBadgeVariants({ role: user.role })}>
        {ROLE_LABELS[user.role]}
      </span>
      <StatusBadge status={user.status} />
      <span className="text-[13px] font-normal leading-none tracking-normal text-slate-600">
        {user.joinDate}
      </span>
      <span className="text-[13px] font-normal leading-none tracking-normal text-slate-600">
        {user.lastActive}
      </span>
      <div className="flex items-center justify-start gap-3">
        <Link
          href={`/users/${user.id}`}
          aria-label={`Edit ${user.name}`}
          className="text-slate-600"
        >
          <Pencil aria-hidden className="size-4" />
        </Link>
        <button
          type="button"
          aria-label={`Delete ${user.name}`}
          onClick={() => onDelete(user.id)}
          className="text-error"
        >
          <Trash2 aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}

function UsersTable({
  users,
  page,
  pageSize,
  total,
  pageAllSelected,
  onToggleUser,
  onTogglePage,
  onDeleteUser,
  onPrevious,
  onNext,
}: {
  users: UserRow[];
  page: number;
  pageSize: number;
  total: number;
  pageAllSelected: boolean;
  onToggleUser: (id: string) => void;
  onTogglePage: () => void;
  onDeleteUser: (id: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <section className="flex w-full flex-col rounded-lg border border-solid border-slate-200 bg-white p-5">
      <div className="w-full overflow-x-auto">
        <div className="w-full min-w-min min-[1200px]:min-w-219">
          <div
            role="row"
            className="users-table-grid grid h-10 items-center gap-4 rounded-md bg-slate-50 px-3"
          >
            <UserSelectControl
              checked={pageAllSelected}
              disabled={users.length === 0}
              label="Select all users on this page"
              onChange={onTogglePage}
            />
            <span role="columnheader" className={HEADER_CELL}>
              User
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Role
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Status
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Join Date
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Last Active
            </span>
            <span role="columnheader" className={HEADER_CELL}>
              Actions
            </span>
          </div>
          {users.length === 0 ? (
            <DataEmpty
              title="No users"
              description="No users match these filters."
            />
          ) : (
            users.map((user) => (
              <UsersTableRow
                key={user.id}
                user={user}
                onToggle={onToggleUser}
                onDelete={onDeleteUser}
              />
            ))
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

export { UsersTable };
