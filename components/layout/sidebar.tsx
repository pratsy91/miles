import { CpuIcon } from "@/components/icons/cpu-icon";
import { Avatar } from "@/components/ui/avatar";
import { SidebarNavItem } from "@/components/ui/sidebar-nav-item";
import { cn } from "cn";
import Link from "next/link";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/users", label: "Users", icon: "users" },
  { href: "/transactions", label: "Transactions", icon: "transactions" },
  { href: "/bookings", label: "Bookings", icon: "bookings" },
] as const;

type SidebarProps = {
  footer?: ReactNode;
  className?: string;
};

function Sidebar({ footer, className }: SidebarProps) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex h-full w-60 shrink-0 flex-col justify-between overflow-hidden bg-slate-800 px-4 py-6 opacity-100",
        className,
      )}
    >
      <div className="flex flex-col gap-6">
        <Link href="/" className="hidden items-center gap-2.5 no-underline md:flex">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <CpuIcon className="size-4.5" />
          </span>
          <span className="font-sans text-[18px] font-bold leading-none tracking-normal text-white">
            AdminHub
          </span>
        </Link>
        <nav className="flex flex-col gap-space-4" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.href} href={item.href} icon={item.icon}>
              {item.label}
            </SidebarNavItem>
          ))}
        </nav>
      </div>
      <footer className="border-t border-solid border-slate-700 pt-4">
        {footer}
        <div className="flex items-center gap-3">
          <Avatar
            src="/sarah.png"
            alt="Sarah Jenkins"
            className="size-9 rounded-[18px] text-[13px]"
          >
            SJ
          </Avatar>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-sans text-[14px] font-semibold leading-none tracking-normal text-white">
              Sarah Jenkins
            </p>
            <p className="font-sans text-[12px] font-medium leading-none tracking-normal text-slate-400">
              Super Admin
            </p>
          </div>
        </div>
      </footer>
    </aside>
  );
}

export { Sidebar };
