"use client";

import { BookingIcon } from "@/components/icons/booking-icon";
import { DashboardIcon } from "@/components/icons/dashboard-icon";
import { TransactionIcon } from "@/components/icons/transaction-icon";
import { cn } from "cn";
import { Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

const NAV_ICONS = {
  dashboard: DashboardIcon,
  users: Users,
  transactions: TransactionIcon,
  bookings: BookingIcon,
} as const;

type SidebarNavIcon = keyof typeof NAV_ICONS;

type SidebarNavItemProps = Omit<ComponentProps<typeof Link>, "children"> & {
  icon: SidebarNavIcon;
  children: string;
  active?: boolean;
};

function hrefToPath(href: SidebarNavItemProps["href"]): string {
  if (typeof href === "string") {
    return href;
  }

  return href.pathname ?? "";
}

function SidebarNavItem({
  className,
  icon,
  children,
  href,
  active,
  ...props
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const hrefPath = hrefToPath(href);
  const isActive =
    active ??
    (hrefPath === "/"
      ? pathname === "/"
      : pathname === hrefPath || pathname.startsWith(`${hrefPath}/`));
  const Icon = NAV_ICONS[icon];

  return (
    <Link
      href={href}
      data-slot="sidebar-nav-item"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group box-border flex w-52 items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 no-underline opacity-100 hover:bg-slate-700 hover:text-slate-200 aria-[current=page]:bg-indigo-600 aria-[current=page]:text-white aria-[current=page]:hover:bg-indigo-600 aria-[current=page]:hover:text-white",
        className,
      )}
      {...props}
    >
      <Icon
        aria-hidden
        className="size-[18px] shrink-0 text-current opacity-50 group-aria-[current=page]:opacity-100"
      />
      <span className="font-sans text-[14px] font-medium leading-none tracking-normal text-[#94A3B8] group-hover:text-slate-200 group-aria-[current=page]:font-semibold group-aria-[current=page]:text-white group-aria-[current=page]:hover:text-white">
        {children}
      </span>
    </Link>
  );
}

export { SidebarNavItem };
export type { SidebarNavIcon };
