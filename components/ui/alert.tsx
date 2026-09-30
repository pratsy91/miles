import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

const alertVariants = cva(
  "box-border flex h-auto min-h-[55px] w-full max-w-[400px] items-center gap-3 rounded-lg px-4 py-3 opacity-100",
  {
    variants: {
      severity: {
        critical: "bg-error-light text-error-dark",
        warning: "bg-warning-light text-warning-dark",
        info: "bg-info-light text-info-dark",
        success: "bg-success-light text-success-dark",
      },
    },
    defaultVariants: {
      severity: "critical",
    },
  },
);

const alertDotVariants = cva("size-2 shrink-0 rounded-full", {
  variants: {
    severity: {
      critical: "bg-error",
      warning: "bg-warning",
      info: "bg-info",
      success: "bg-success",
    },
  },
  defaultVariants: {
    severity: "critical",
  },
});

type AlertProps = ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    title: string;
    description: string;
  };

function Alert({
  className,
  severity = "critical",
  title,
  description,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ severity, className }))}
      {...props}
    >
      <span aria-hidden className={alertDotVariants({ severity })} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-[13px] font-medium leading-none">{title}</p>
        <p className="text-[11px] font-normal leading-[14px]">{description}</p>
      </div>
    </div>
  );
}

export { Alert, alertVariants };
