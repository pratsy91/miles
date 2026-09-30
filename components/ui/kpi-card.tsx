import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { ArrowDown, ArrowRight, ArrowUp, type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

const trendBadgeVariants = cva(
  "box-border inline-flex h-[17px] w-fit shrink-0 items-center gap-0.5 rounded-[4px] px-[6px] py-[2px] text-[11px] font-bold leading-none tracking-normal",
  {
    variants: {
      variant: {
        up: "bg-success-light text-success-dark",
        down: "bg-error-light text-error-dark",
        neutral: "bg-slate-100 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "up",
    },
  },
);

type KpiCardProps = Omit<ComponentProps<"article">, "title"> &
  VariantProps<typeof trendBadgeVariants> & {
    title: ReactNode;
    value: ReactNode;
    trend: string;
    subtitle: ReactNode;
    icon: LucideIcon;
    iconClassName?: string;
  };

function KpiCard({
  className,
  variant = "up",
  title,
  value,
  trend,
    subtitle,
    icon: Icon,
    iconClassName,
    ...props
  }: KpiCardProps) {
  const TrendIcon =
    variant === "down" ? ArrowDown : variant === "neutral" ? ArrowRight : ArrowUp;

  return (
    <article
      data-slot="kpi-card"
      className={cn(
        "box-border flex h-[134px] min-w-0 w-full flex-col rounded-lg border border-solid border-slate-200 bg-white p-5 max-md:h-[93px] max-md:gap-2 max-md:rounded-[8px] max-md:p-3",
        className,
      )}
      {...props}
    >
      <div className="flex h-8 items-center justify-between max-md:h-auto">
        <p className="font-sans text-[14px] font-medium leading-none tracking-normal text-slate-500 max-md:text-[12px]">
          {title}
        </p>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-50",
            iconClassName,
          )}
        >
          <Icon aria-hidden className="size-4 text-indigo-600" strokeWidth={2.5} />
        </span>
      </div>
      <p className="mt-[12px] font-sans text-[24px] font-bold leading-none tracking-normal text-slate-900 max-md:mt-0 max-md:text-[18px]">
        {value}
      </p>
      <div className="mt-[7px] flex items-center gap-1.5 max-md:mt-0">
        <span className={trendBadgeVariants({ variant })}>
          <TrendIcon aria-hidden className="size-3 shrink-0" strokeWidth={2.5} />
          {trend}
        </span>
        <span className="text-[11px] font-normal leading-none tracking-normal text-slate-500">
          {subtitle}
        </span>
      </div>
    </article>
  );
}

export { KpiCard, trendBadgeVariants };
