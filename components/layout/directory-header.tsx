"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus, type LucideIcon } from "lucide-react";

const ACTION_ICONS = {
  plus: Plus,
  download: Download,
} as const;

type DirectoryHeaderProps = {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionIcon?: keyof typeof ACTION_ICONS;
  actionVariant?: "primary" | "ghost";
  onAction?: () => void;
};

function DirectoryHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon = "plus",
  actionVariant = "primary",
  onAction,
}: DirectoryHeaderProps) {
  const Icon: LucideIcon = ACTION_ICONS[actionIcon];
  const actionClassName =
    actionVariant === "ghost"
      ? "h-[37px] w-[135px] rounded-lg border border-slate-200 bg-white px-4 text-[14px] font-semibold leading-none tracking-normal text-slate-600"
      : "px-4 text-[14px] font-semibold leading-none tracking-normal";

  return (
    <section className="flex items-center justify-between">
      <div className="flex flex-col gap-space-4">
        <h2 className="text-heading-2 leading-none tracking-normal text-slate-900">
          {title}
        </h2>
        <p className="text-body leading-none tracking-normal text-slate-500">
          {subtitle}
        </p>
      </div>
      <Button
        size="md"
        variant={actionVariant}
        icon={Icon}
        className={actionClassName}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </section>
  );
}

export { DirectoryHeader };
