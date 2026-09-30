import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

const STATUS_LABELS = {
  active: "Active",
  completed: "Completed",
  confirmed: "Confirmed",
  pending: "Pending",
  processing: "Processing",
  failed: "Failed",
  cancelled: "Cancelled",
  suspended: "Suspended",
  inactive: "Inactive",
  refunded: "Refunded",
  info: "Info",
} as const;

const badgeVariants = cva(
  "box-border inline-flex h-[21px] w-fit items-center justify-center rounded-[12px] px-2 py-1 text-[11px] font-semibold leading-none tracking-normal whitespace-nowrap opacity-100",
  {
    variants: {
      status: {
        active: "bg-success-light text-success-dark",
        completed: "bg-success-light text-success-dark",
        confirmed: "bg-success-light text-success-dark",
        pending: "bg-warning-light text-warning-dark",
        processing: "bg-warning-light text-warning-dark",
        failed: "bg-error-light text-error-dark",
        cancelled: "bg-error-light text-error-dark",
        suspended: "bg-error-light text-error-dark",
        inactive: "bg-warning-light text-warning-dark",
        refunded: "bg-info-light text-info-dark",
        info: "bg-info-light text-info-dark",
      },
    },
    defaultVariants: {
      status: "active",
    },
  },
);

function StatusBadge({
  className,
  status = "active",
  children,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  const label =
    children ?? (status ? STATUS_LABELS[status] : STATUS_LABELS.active);

  return (
    <span
      data-slot="status-badge"
      className={cn(badgeVariants({ status, className }))}
      {...props}
    >
      {label}
    </span>
  );
}

export { StatusBadge, badgeVariants };
