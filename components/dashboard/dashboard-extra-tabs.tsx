import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { InfoRows } from "@/components/users/user-detail-columns";
import { BarChart3, MousePointerClick, Percent, Timer } from "lucide-react";

const ANALYTICS_KPIS = [
  {
    id: "views",
    title: "Page Views",
    value: "482,193",
    trend: "6.4%",
    variant: "up",
    icon: BarChart3,
  },
  {
    id: "conversion",
    title: "Conversion",
    value: "4.8%",
    trend: "1.2%",
    variant: "up",
    icon: Percent,
  },
  {
    id: "session",
    title: "Avg. Session",
    value: "6m 42s",
    trend: "5.4%",
    variant: "up",
    icon: Timer,
  },
  {
    id: "bounce",
    title: "Bounce Rate",
    value: "32.1%",
    trend: "2.6%",
    variant: "down",
    icon: MousePointerClick,
  },
] as const;

const CHANNELS = [
  { label: "Direct", value: "38%" },
  { label: "Organic Search", value: "27%" },
  { label: "Referral", value: "18%" },
  { label: "Campaigns", value: "17%" },
] as const;

const DEVICES = [
  { label: "Desktop", value: "61%" },
  { label: "Mobile", value: "34%" },
  { label: "Tablet", value: "5%" },
] as const;

const REPORTS = [
  {
    name: "Revenue Summary",
    period: "Sep 1 – Sep 30, 2026",
    status: "completed",
    label: "Ready",
  },
  {
    name: "User Growth",
    period: "Q3 2026",
    status: "completed",
    label: "Ready",
  },
  {
    name: "Bookings Export",
    period: "Last 30 days",
    status: "pending",
    label: "Pending",
  },
  {
    name: "Transactions Ledger",
    period: "Sep 2026",
    status: "info",
    label: "Scheduled",
  },
] as const;

function DashboardExtraTabs() {
  return (
    <>
      <TabsContent value="analytics" className="flex flex-col gap-6 max-md:gap-4">
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {ANALYTICS_KPIS.map((kpi) => (
            <KpiCard
              key={kpi.id}
              icon={kpi.icon}
              iconClassName="max-md:hidden"
              title={kpi.title}
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
        <section className="hidden items-start gap-6 md:grid xl:grid-cols-2">
          <article className="flex min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
            <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
              Traffic by Channel
            </h3>
            <InfoRows rows={CHANNELS.map((row) => ({ ...row }))} />
          </article>
          <article className="flex min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
            <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
              Devices
            </h3>
            <InfoRows rows={DEVICES.map((row) => ({ ...row }))} />
          </article>
        </section>
        <section className="flex flex-col gap-4 md:hidden">
          <article className="box-border flex w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
            <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
              Traffic by Channel
            </h3>
            <div className="flex flex-col gap-2">
              {CHANNELS.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <span className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
                    {row.label}
                  </span>
                  <span className="font-sans text-[12px] font-semibold leading-none tracking-normal text-slate-900">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </article>
          <article className="box-border flex w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
            <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
              Devices
            </h3>
            <div className="flex flex-col gap-2">
              {DEVICES.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <span className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
                    {row.label}
                  </span>
                  <span className="font-sans text-[12px] font-semibold leading-none tracking-normal text-slate-900">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </TabsContent>

      <TabsContent value="reports" className="flex flex-col gap-6 max-md:gap-4">
        <article className="hidden min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5 md:flex">
          <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
            Saved Reports
          </h3>
          <div className="flex flex-col">
            {REPORTS.map((report) => (
              <div
                key={report.name}
                className="flex items-center justify-between gap-4 border-b border-slate-200 py-3 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold leading-none tracking-normal text-slate-900">
                    {report.name}
                  </p>
                  <p className="mt-1 text-[12px] font-normal leading-none tracking-normal text-slate-500">
                    {report.period}
                  </p>
                </div>
                <StatusBadge status={report.status}>{report.label}</StatusBadge>
              </div>
            ))}
          </div>
        </article>
        <div className="flex flex-col gap-3 md:hidden">
          <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
            Saved Reports
          </h3>
          {REPORTS.map((report) => (
            <article
              key={report.name}
              className="box-border flex w-full items-center justify-between gap-3 rounded-lg border border-solid border-slate-200 bg-white p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-sans text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                  {report.name}
                </p>
                <p className="mt-0.5 font-sans text-[11px] font-normal leading-none tracking-normal text-slate-500">
                  {report.period}
                </p>
              </div>
              <StatusBadge status={report.status}>{report.label}</StatusBadge>
            </article>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="settings" className="flex flex-col gap-6 max-md:hidden">
        <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
          <article className="flex min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
            <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
              Profile
            </h3>
            <InfoRows
              rows={[
                { label: "Name", value: "Sarah Johnson" },
                { label: "Email", value: "sarah.johnson@adminhub.com" },
                { label: "Role", value: "Administrator" },
              ]}
            />
          </article>
          <article className="flex min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
            <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
              Appearance
            </h3>
            <InfoRows
              rows={[
                { label: "Theme", value: "Light" },
                { label: "Sidebar", value: "Expanded" },
                { label: "Density", value: "Comfortable" },
              ]}
            />
          </article>
          <article className="flex min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
            <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
              Notifications
            </h3>
            <InfoRows
              rows={[
                { label: "Email Alerts", badge: "Enabled" },
                { label: "Weekly Digest", badge: "Enabled" },
                { label: "SMS Alerts", value: "Disabled" },
              ]}
            />
          </article>
          <article className="flex min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
            <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
              Workspace
            </h3>
            <InfoRows
              rows={[
                { label: "Time Zone", value: "Eastern Time" },
                { label: "Currency", value: "USD" },
                { label: "Date Format", value: "MMM D, YYYY" },
              ]}
            />
          </article>
          <article className="flex min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
            <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
              Security
            </h3>
            <InfoRows
              rows={[
                { label: "Two-Factor", badge: "Enabled" },
                { label: "Session Timeout", value: "30 minutes" },
                { label: "Password Policy", value: "Strong" },
              ]}
            />
          </article>
          <article className="flex min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5">
            <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
              Data
            </h3>
            <InfoRows
              rows={[
                { label: "Export Format", value: "CSV" },
                { label: "Backup", value: "Daily" },
                { label: "Retention", value: "12 months" },
              ]}
            />
          </article>
        </section>
      </TabsContent>
    </>
  );
}

export { DashboardExtraTabs };
