"use client";

import { ChevronDown, Search } from "lucide-react";

function FilterSelect({
  label,
  labelClass,
  options,
  value,
  onChange,
}: {
  label: string;
  labelClass: string;
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  if (options && value !== undefined && onChange) {
    return (
      <label className="relative inline-flex h-8 w-full shrink-0 sm:w-fit">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-8 w-full appearance-none rounded-lg border border-solid border-slate-200 bg-white py-2 pr-8 pl-3 text-[13px] font-medium leading-none tracking-normal outline-none sm:w-fit ${labelClass}`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {label ? `${label} ${option}` : option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-500"
        />
      </label>
    );
  }

  return (
    <button
      type="button"
      className="inline-flex h-8 w-full shrink-0 items-center justify-between gap-1.5 rounded-lg border border-solid border-slate-200 bg-white px-3 py-2 whitespace-nowrap sm:w-fit"
    >
      <span
        className={`text-[13px] font-medium leading-none tracking-normal ${labelClass}`}
      >
        {label}
      </span>
      <ChevronDown aria-hidden className="size-4 shrink-0 text-slate-500" />
    </button>
  );
}

type FilterConfig = {
  label: string;
  value?: string;
  options?: string[];
  onChange?: (value: string) => void;
};

type FiltersBarProps = {
  searchPlaceholder: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  filters: FilterConfig[];
  sort?: {
    label: string;
    value: string;
    options?: string[];
    onChange?: (value: string) => void;
  };
};

function FiltersBar({
  searchPlaceholder,
  search,
  onSearchChange,
  filters,
  sort,
}: FiltersBarProps) {
  return (
    <section className="flex min-h-16 w-full flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="flex h-8 w-full items-center gap-2 rounded-lg border border-solid border-slate-200 bg-white px-3 py-2 sm:w-[280px] sm:shrink-0">
          <Search aria-hidden className="size-4 shrink-0 text-slate-400" />
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={search}
            onChange={
              onSearchChange
                ? (event) => onSearchChange(event.target.value)
                : undefined
            }
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-[13px] font-normal leading-none tracking-normal text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
        {filters.map((filter) => (
          <FilterSelect
            key={filter.label}
            label={filter.options ? `${filter.label}:` : filter.label}
            value={filter.value}
            options={filter.options}
            onChange={filter.onChange}
            labelClass="text-slate-600"
          />
        ))}
      </div>

      {sort ? (
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-normal leading-none tracking-normal text-slate-500">
            {sort.label}
          </span>
          <FilterSelect
            label=""
            value={sort.value}
            options={sort.options}
            onChange={sort.onChange}
            labelClass="text-slate-900"
          />
        </div>
      ) : null}
    </section>
  );
}

export { FiltersBar };
