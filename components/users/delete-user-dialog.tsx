"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

function DeleteUserDialog({
  name,
  onCancel,
  onConfirm,
}: {
  name: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!name) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [name, onCancel]);

  if (!name) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="alertdialog"
        aria-labelledby="delete-user-title"
        aria-describedby="delete-user-warning"
        className="flex w-full max-w-[420px] flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5"
      >
        <div className="flex flex-col gap-2">
          <h2
            id="delete-user-title"
            className="font-sans text-[16px] font-bold leading-none tracking-normal text-slate-900"
          >
            Delete user
          </h2>
          <p
            id="delete-user-warning"
            className="font-sans text-[13px] font-normal leading-[18px] tracking-normal text-slate-500"
          >
            This will permanently remove {name} from the directory. This cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" size="md" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DeleteUserDialog };
