"use client";

import type { UserRole } from "@/lib/users-store";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

type UsersSelectionBarProps = {
  count: number;
  onChangeRole: (role: UserRole) => void;
  onSuspend: () => void;
};

function UsersSelectionBar({ count, onChangeRole, onSuspend }: UsersSelectionBarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <section className="flex min-h-12.75 w-full flex-col gap-3 rounded-lg border border-solid border-indigo-600 bg-indigo-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-indigo-600">
        <Check aria-hidden className="size-4 shrink-0" strokeWidth={2.5} />
        <p className="text-[13px] font-semibold leading-none tracking-normal">
          {count} users selected
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-6.75 items-center justify-center rounded-md border border-solid border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium leading-none tracking-normal whitespace-nowrap text-slate-900"
          >
            Change Role
          </button>
          {open ? (
            <div
              role="menu"
              className="absolute top-[calc(100%+4px)] right-0 z-20 min-w-35 overflow-hidden rounded-md border border-solid border-slate-200 bg-white py-1 shadow-ds-md"
            >
              {ROLES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="menuitem"
                  className="flex h-8 w-full items-center px-3 text-left font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900 hover:bg-indigo-50"
                  onClick={() => {
                    onChangeRole(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onSuspend}
          className="inline-flex h-6.75 items-center justify-center rounded-md border border-solid border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium leading-none tracking-normal whitespace-nowrap text-error"
        >
          Suspend Accounts
        </button>
      </div>
    </section>
  );
}

export { UsersSelectionBar };
