"use client";

import {
  TabBookingsIcon,
  TabDashboardIcon,
  TabProfileIcon,
  TabUsersIcon,
} from "@/components/icons/mobile-nav-icons";
import { cn } from "cn";
import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

const ITEMS: { href: string; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { href: "/", label: "Dashboard", icon: TabDashboardIcon },
  { href: "/users", label: "Users", icon: TabUsersIcon },
  { href: "/transactions", label: "Transaction", icon: ArrowLeftRight },
  { href: "/bookings", label: "Bookings", icon: TabBookingsIcon },
  { href: "/profile", label: "Profile", icon: TabProfileIcon },
];

function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile"
      data-mobile-outline=""
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-solid border-slate-200 bg-white px-2 md:hidden"
    >
      {ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : item.href
              ? pathname === item.href || pathname.startsWith(`${item.href}/`)
              : false;
        const Icon = item.icon;
        const className = cn(
          "flex min-w-0 flex-1 flex-col items-center gap-1 text-[11px] font-medium leading-none tracking-normal",
          active ? "text-indigo-600" : "text-slate-400",
        );
        const content = (
          <>
            <Icon aria-hidden className="size-5" />
            {item.label}
          </>
        );

        return (
          <Link key={item.href} href={item.href} className={className}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}

export { MobileTabBar };
