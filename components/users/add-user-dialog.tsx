"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addUser, readUsers, type UserRole } from "@/lib/users-store";
import { useAlerts } from "@/components/ui/alerts";
import { useEffect, useState, type FormEvent } from "react";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "viewer", label: "Viewer" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
];

function AddUserDialog({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");
  const [error, setError] = useState<string | null>(null);
  const notify = useAlerts();

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

  if (!open) {
    return null;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) {
      setError("Name and email are required.");
      return;
    }

    const duplicate = (readUsers() ?? []).some(
      (user) => user.email.toLowerCase() === trimmedEmail.toLowerCase(),
    );
    if (duplicate) {
      setError("A user with this email already exists.");
      return;
    }

    addUser({ name: trimmedName, email: trimmedEmail, role });
    notify({
      severity: "success",
      title: "User added",
      description: `${trimmedName} was added to the directory.`,
    });
    setName("");
    setEmail("");
    setRole("viewer");
    setError(null);
    onAdded();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        onSubmit={submit}
        className="flex w-full max-w-[420px] flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5"
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-sans text-[16px] font-bold leading-none tracking-normal text-slate-900">
            Add User
          </h2>
          <p className="font-sans text-[13px] font-normal leading-none tracking-normal text-slate-500">
            Create a new user in the directory.
          </p>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-700">
            Name
          </span>
          <Input
            value={name}
            onValueChange={setName}
            placeholder="Full name"
            autoComplete="name"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-700">
            Email
          </span>
          <Input
            type="email"
            value={email}
            onValueChange={setEmail}
            placeholder="name@email.com"
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-[13px] font-medium leading-none tracking-normal text-slate-700">
            Role
          </span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            className="box-border h-[39px] w-full rounded-[8px] border border-solid border-slate-300 bg-white px-3.5 text-[14px] leading-none tracking-normal text-slate-900 outline-none focus:border-2 focus:border-indigo-600"
          >
            {ROLES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {error ? (
          <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-error">
            {error}
          </p>
        ) : null}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={!name.trim() || !email.trim()}>
            Add User
          </Button>
        </div>
      </form>
    </div>
  );
}

export { AddUserDialog };
