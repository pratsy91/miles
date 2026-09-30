"use client";

import { ChevronDown, Filter } from "lucide-react";

type MobileFilterOption = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function MobileFilterButton({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={open}
      onClick={onToggle}
      className="box-border flex size-9 shrink-0 items-center justify-center rounded-lg border border-solid border-slate-200 bg-white text-slate-600"
    >
      <Filter aria-hidden className="size-4" />
    </button>
  );
}

function MobileFilterPanel({
  open,
  filters,
}: {
  open: boolean;
  filters: MobileFilterOption[];
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {filters.map((filter) => (
        <label key={filter.label} className="relative flex h-8 w-full">
          <select
            value={filter.value}
            onChange={(event) => filter.onChange(event.target.value)}
            aria-label={filter.label}
            className="h-8 w-full appearance-none rounded-lg border border-solid border-slate-200 bg-white py-2 pr-8 pl-3 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-600 outline-none"
          >
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {filter.label}: {option}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-500"
          />
        </label>
      ))}
    </div>
  );
}

export { MobileFilterButton, MobileFilterPanel };
export type { MobileFilterOption };
