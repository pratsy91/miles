import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { DashboardKpis } from "@/components/dashboard/dashboard-kpis";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { RevenueOverview } from "@/components/dashboard/revenue-overview";
import { InfoRows } from "@/components/users/user-detail-columns";
import { DashboardExtraTabs } from "@/components/dashboard/dashboard-extra-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DASHBOARD_TABS = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "reports", label: "Reports" },
  { value: "settings", label: "Settings" },
] as const;

const MOBILE_TAB_CLASS =
  "max-md:box-border max-md:h-7! max-md:w-[84px] max-md:shrink-0 max-md:rounded-[6px] max-md:border max-md:border-slate-200 max-md:bg-white max-md:px-3! max-md:py-1.5! max-md:font-sans max-md:text-[13px]! max-md:font-semibold! max-md:leading-none max-md:tracking-normal max-md:whitespace-nowrap max-md:text-slate-700 max-md:data-active:h-7! max-md:data-active:w-[84px] max-md:data-active:rounded-[6px] max-md:data-active:border-b! max-md:data-active:border-indigo-600 max-md:data-active:bg-indigo-600! max-md:data-active:px-3! max-md:data-active:py-1.5! max-md:data-active:text-[13px]! max-md:data-active:font-semibold! max-md:data-active:leading-none max-md:data-active:text-white! max-md:data-active:hover:text-white!";

const SYSTEM_ALERTS = [
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
    mobileTitle: "System maintenance",
    detail: "Scheduled for Oct 5",
    time: "Yesterday",
    dotClassName: "bg-info",
  },
] as const;

export default function DashboardPage() {
  return (
    <main
      data-slot="dashboard-page"
      className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20"
    >
      <div className="flex flex-col gap-1 md:hidden">
        <h1 className="font-sans text-[18px] font-bold leading-none tracking-normal text-slate-900">
          Welcome back, Sarah
        </h1>
        <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <Tabs defaultValue="overview" className="w-full gap-6 max-md:gap-4">
        <TabsList className="box-border flex w-full items-center gap-2 overflow-x-auto md:h-10.25 md:items-end md:overflow-visible md:border-b md:border-solid md:border-slate-200 md:pb-1">
          {DASHBOARD_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`${MOBILE_TAB_CLASS} ${tab.value === "settings" ? "max-md:hidden" : ""}`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview" className="flex flex-col gap-6 max-md:gap-4">
      <DashboardKpis />
      <section className="grid grid-cols-1 items-start gap-6 max-md:gap-4 xl:grid-cols-[minmax(0,752px)_minmax(240px,1fr)]">
        <div className="min-w-0 max-md:order-1">
          <RevenueOverview />
        </div>
        <article className="hidden min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5 md:flex">
          <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
            System Alerts
          </h3>
          <div className="flex flex-col gap-4">
            {SYSTEM_ALERTS.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`mt-1.25 size-2 shrink-0 rounded-full ${item.dotClassName}`}
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-[13px] font-semibold leading-4.5 tracking-normal text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-[12px] font-normal leading-4 tracking-normal text-slate-600">
                    {item.detail}
                  </p>
                  <p className="text-[11px] font-normal leading-3.5 tracking-normal text-slate-500">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="box-border flex w-full min-w-0 flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4 max-md:order-3 md:hidden">
          <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
            System Alerts
          </h3>
          <div className="flex flex-col gap-3">
            {SYSTEM_ALERTS.map((item) => (
              <div key={`mobile-${item.title}`} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`mt-1.25 size-2 shrink-0 rounded-full ${item.dotClassName}`}
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="font-sans text-[12px] font-semibold leading-none tracking-normal text-slate-900">
                    {"mobileTitle" in item ? item.mobileTitle : item.title}
                  </p>
                  <p className="font-sans text-[11px] font-normal leading-none tracking-normal text-slate-600">
                    {item.detail}
                  </p>
                  <p className="font-sans text-[10px] font-normal leading-none tracking-normal text-slate-500">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
        <div className="min-w-0 max-md:order-2">
          <RecentTransactions />
        </div>
        <article className="hidden min-w-0 flex-col gap-4 rounded-lg border border-solid border-slate-200 bg-white p-5 md:flex">
          <h3 className="text-[16px] font-bold leading-none tracking-normal text-slate-900">
            System Health
          </h3>
          <InfoRows
            rows={[
              { label: "Uptime", value: "99.8%" },
              { label: "Avg Response Time", value: "142ms" },
              { label: "Active Sessions", value: "3,241" },
            ]}
          />
        </article>
        <article className="box-border flex w-full min-w-0 flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4 max-md:order-4 md:hidden">
          <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
            System Health
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { label: "Uptime", value: "99.8%" },
              { label: "Avg Response Time", value: "142ms" },
            ].map((row) => (
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
        <DashboardExtraTabs />
      </Tabs>
      <MobileTabBar />
    </main>
  );
}
