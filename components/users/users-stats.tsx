import { cn } from "cn";
import type { ReactNode } from "react";

type UsersStat = {
  label: string;
  value: string;
  valueClassName?: string;
  trailing?: ReactNode;
};

function UsersStatCard({ label, value, valueClassName, trailing }: UsersStat) {
  const text = (
    <div className={trailing ? "flex min-w-0 flex-col gap-2" : "contents"}>
      <p className="text-[13px] font-normal leading-none tracking-normal text-slate-500">
        {label}
      </p>
      <p
        className={cn(
          "text-[20px] font-bold leading-none tracking-normal text-slate-900",
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  );

  if (trailing) {
    return (
      <article className="flex h-20 min-w-0 items-center gap-18.75 rounded-lg border border-solid border-slate-200 bg-white p-4">
        {text}
        {trailing}
      </article>
    );
  }

  return (
    <article className="flex h-20 min-w-0 flex-col gap-2 rounded-lg border border-solid border-slate-200 bg-white p-4">
      {text}
    </article>
  );
}

function UsersStats({ stats }: { stats: UsersStat[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <UsersStatCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </section>
  );
}

export { UsersStatCard, UsersStats };
export type { UsersStat };
