"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { useBookings } from "@/hooks/use-bookings";
import { useTransactions } from "@/hooks/use-transactions";
import { useUsers } from "@/hooks/use-users";
import { isActiveBooking } from "@/lib/bookings-store";
import { formatCount, formatMoney, monthStart, percentChange } from "@/lib/format";
import { netRevenue } from "@/lib/revenue";
import { ArrowLeftRight, Calendar, DollarSign, Users, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

function DashboardKpis() {
  const { users } = useUsers();
  const { transactions } = useTransactions();
  const { bookings } = useBookings();
  const start = monthStart(0);

  const userList = users ?? [];
  const transactionList = transactions ?? [];
  const bookingList = bookings ?? [];

  const usersNow = userList.length;
  const usersBefore = userList.filter((user) => user.joinTime < start).length;

  const revenueNow = transactionList.reduce((sum, item) => sum + netRevenue(item), 0);
  const revenueBefore = transactionList
    .filter((item) => item.occurredAt < start)
    .reduce((sum, item) => sum + netRevenue(item), 0);

  const active = bookingList.filter(isActiveBooking);
  const activeNow = active.length;
  const activeBefore = active.filter((item) => item.occurredAt < start).length;

  const pending = transactionList.filter((item) => item.status === "pending");
  const pendingNow = pending.length;
  const pendingBefore = pending.filter((item) => item.occurredAt < start).length;

  const cards: {
    id: string;
    title: string;
    mobileTitle?: string;
    value: ReactNode;
    trend: string;
    variant: "up" | "down" | "neutral";
    icon: LucideIcon;
  }[] = [
    {
      id: "users",
      title: "Total Users",
      value: users == null ? (
        <span className="inline-block h-6 w-16 animate-pulse rounded bg-slate-100" />
      ) : (
        formatCount(usersNow)
      ),
      ...percentChange(usersNow, usersBefore),
      icon: Users,
    },
    {
      id: "revenue",
      title: "Total Revenue",
      value: transactions == null ? (
        <span className="inline-block h-6 w-24 animate-pulse rounded bg-slate-100" />
      ) : (
        formatMoney(revenueNow)
      ),
      ...percentChange(revenueNow, revenueBefore),
      icon: DollarSign,
    },
    {
      id: "bookings",
      title: "Active Bookings",
      value: bookings == null ? (
        <span className="inline-block h-6 w-12 animate-pulse rounded bg-slate-100" />
      ) : (
        formatCount(activeNow)
      ),
      ...percentChange(activeNow, activeBefore),
      icon: Calendar,
    },
    {
      id: "pending",
      title: "Pending Transactions",
      mobileTitle: "Pending Txns",
      value: transactions == null ? (
        <span className="inline-block h-6 w-12 animate-pulse rounded bg-slate-100" />
      ) : (
        formatCount(pendingNow)
      ),
      ...percentChange(pendingNow, pendingBefore),
      icon: ArrowLeftRight,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map((kpi) => (
        <KpiCard
          key={kpi.id}
          icon={kpi.icon}
          iconClassName="max-md:hidden"
          title={
            kpi.mobileTitle ? (
              <>
                <span className="md:hidden">{kpi.mobileTitle}</span>
                <span className="hidden md:inline">{kpi.title}</span>
              </>
            ) : (
              kpi.title
            )
          }
          value={kpi.value}
          trend={kpi.trend}
          subtitle={
            <>
              <span className="md:hidden">vs last mo</span>
              <span className="hidden md:inline">vs last month</span>
            </>
          }
          variant={kpi.variant}
        />
      ))}
    </section>
  );
}

export { DashboardKpis };
