"use client";

import { BellIcon } from "@/components/icons/bell-icon";
import { ConsoleSearch } from "@/components/layout/console-search";
import { Avatar } from "@/components/ui/avatar";
import { useAppDispatch } from "@/hooks/use-redux";
import { toggleSidebar } from "@/lib/store/ui-slice";
import { ArrowLeft, Bell, Ellipsis, Menu, Pencil, Printer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const PAGE_TITLES: { prefix: string; title: string }[] = [
  { prefix: "/users/", title: "User Directory" },
  { prefix: "/users", title: "User Management" },
  { prefix: "/transactions/", title: "Transactions Log" },
  { prefix: "/transactions", title: "Transactions" },
  { prefix: "/bookings/", title: "Booking Management" },
  { prefix: "/bookings", title: "Bookings" },
  { prefix: "/profile", title: "Profile" },
  { prefix: "/", title: "Welcome back, Sarah" },
];

function titleForPath(pathname: string): string {
  const match = PAGE_TITLES.find((item) =>
    item.prefix === "/" ? pathname === "/" : pathname.startsWith(item.prefix),
  );

  return match?.title ?? "Dashboard";
}

function formatHeaderDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const NOTIFICATIONS = [
  {
    title: "Server capacity at 92%",
    detail: "Scale resources",
    time: "2 hours ago",
    dotClassName: "bg-error",
  },
  {
    title: "15 transactions pending",
    detail: "Pending review",
    time: "5 hours ago",
    dotClassName: "bg-warning",
  },
  {
    title: "System maintenance scheduled",
    detail: "Scheduled for Oct 5",
    time: "Yesterday",
    dotClassName: "bg-info",
  },
] as const;

function NotificationButton({
  className,
  badgeClassName = "-top-0.5 -right-0.5 size-[18px] rounded-[9px]",
  children,
}: {
  className: string;
  badgeClassName?: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 320 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function place() {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      const width = Math.min(320, window.innerWidth - 32);
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(16, rect.right - width),
        width,
      });
    }

    function onPointerDown(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (rootRef.current?.contains(target)) {
        return;
      }
      if (target instanceof Element && target.closest("[data-notifications]")) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    place();
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  return (
    <div ref={rootRef}>
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
        className={className}
      >
        {children}
        <span
          className={`absolute flex items-center justify-center bg-error text-[10px] font-bold leading-none text-white ${badgeClassName}`}
        >
          3
        </span>
      </button>
      {open && mounted
        ? createPortal(
            <div
              data-notifications
              role="dialog"
              aria-label="Notifications"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
              }}
              className="fixed z-50 rounded-lg border border-solid border-slate-200 bg-white p-4 shadow-ds-md"
            >
              <p className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
                Notifications
              </p>
              <div className="mt-3 flex flex-col gap-3">
                {NOTIFICATIONS.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={`mt-1.25 size-2 shrink-0 rounded-full ${item.dotClassName}`}
                    />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="font-sans text-[13px] font-semibold leading-4.5 tracking-normal text-slate-900">
                        {item.title}
                      </p>
                      <p className="font-sans text-[12px] font-normal leading-4 tracking-normal text-slate-600">
                        {item.detail}
                      </p>
                      <p className="font-sans text-[11px] font-normal leading-3.5 tracking-normal text-slate-500">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function Header() {
  const pathname = usePathname();
  const title = titleForPath(pathname);
  const dispatch = useAppDispatch();
  const mobileDetail = /^\/users\/[^/]+$/.test(pathname)
    ? { href: "/users", title: "User Detail", action: "edit" as const }
    : /^\/transactions\/[^/]+$/.test(pathname)
      ? {
          href: "/transactions",
          title: "Transaction Detail",
          action: "print" as const,
        }
      : /^\/bookings\/[^/]+$/.test(pathname)
        ? {
            href: "/bookings",
            title: "Booking Detail",
            action: "more" as const,
          }
        : null;
  const styledDetailBar =
    mobileDetail?.action === "edit" ||
    mobileDetail?.action === "print" ||
    mobileDetail?.action === "more";

  return (
    <>
      <header
        data-slot="header"
        className="hidden h-17.5 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 md:flex"
      >
        <div className="flex min-w-0 flex-col gap-space-4">
          <h1 className="truncate text-[18px] font-bold leading-none tracking-normal text-slate-900">
            {title}
          </h1>
          <p className="truncate text-[12px] font-normal leading-none tracking-normal text-slate-500">
            {formatHeaderDate(new Date())}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="max-[851px]:hidden">
            <ConsoleSearch />
          </div>

          <NotificationButton className="relative flex size-10 items-center justify-center rounded-[20px] border border-solid border-slate-200 bg-white">
            <Bell aria-hidden className="size-5 text-slate-600" />
          </NotificationButton>

          <Avatar size="md" src="/sarah.png" alt="Sarah Jenkins">
            SJ
          </Avatar>
        </div>
      </header>
      <header
        data-slot="mobile-header"
        {...(mobileDetail ? { "data-mobile-outline": "" } : {})}
        className={`box-border flex h-14 w-full shrink-0 items-center justify-between border-b border-solid border-slate-200 bg-white px-4 md:hidden ${
          styledDetailBar ? "py-2" : ""
        }`}
      >
        {mobileDetail ? (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Link
                href={mobileDetail.href}
                aria-label={`Back to ${mobileDetail.href.slice(1)}`}
                className="flex size-5 shrink-0 items-center justify-center text-slate-900"
              >
                <ArrowLeft aria-hidden className="size-5" />
              </Link>
              <h1 className="min-w-0 truncate text-left font-sans text-[16px] font-bold leading-none tracking-normal text-slate-900">
                {mobileDetail.title}
              </h1>
            </div>
            <button
              type="button"
              aria-label={
                mobileDetail.action === "print"
                  ? "Print receipt"
                  : mobileDetail.action === "more"
                    ? "More actions"
                    : "Edit user"
              }
              onClick={() => {
                if (mobileDetail.action === "print") {
                  window.dispatchEvent(new Event("miles-print-transaction"));
                }
              }}
              className={
                styledDetailBar
                  ? "box-border flex size-7 shrink-0 items-center justify-center rounded-[20px] border border-solid border-slate-200 p-1.5 text-slate-700"
                  : "flex size-8 items-center justify-center rounded-full border border-solid border-slate-200 text-slate-700"
              }
            >
              {mobileDetail.action === "print" ? (
                <Printer aria-hidden className="size-4" />
              ) : mobileDetail.action === "more" ? (
                <Ellipsis aria-hidden className="size-4" />
              ) : (
                <Pencil aria-hidden className="size-4" />
              )}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                className="flex size-5 items-center justify-center text-slate-800"
                onClick={() => dispatch(toggleSidebar())}
              >
                <Menu aria-hidden className="size-5" />
              </button>
              <Link href="/" className="flex items-center gap-2.5 no-underline">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[#4F46E5]">
                  <span aria-hidden className="size-3 bg-white" />
                </span>
                <span className="font-sans text-[16px] font-bold leading-none tracking-normal text-slate-900">
                  AdminHub
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <NotificationButton
                className="relative box-border flex size-8 items-center justify-center rounded-2xl border border-solid border-slate-200 bg-white text-slate-600"
                badgeClassName="-top-0.5 -right-0.5 size-[14px] rounded-[7px]"
              >
                <BellIcon />
              </NotificationButton>
              <Avatar
                src="/sarah.png"
                alt="Sarah Jenkins"
                className="size-8 rounded-2xl text-[12px]"
              >
                SJ
              </Avatar>
            </div>
          </>
        )}
      </header>
    </>
  );
}

export { Header };
