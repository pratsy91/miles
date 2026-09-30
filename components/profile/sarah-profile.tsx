import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";

function randomizer(seed: number) {
  let value = seed % 233280;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function pick<T>(items: readonly T[], random: () => number) {
  return items[Math.floor(random() * items.length)] ?? items[0];
}

const random = randomizer(42);

const SARAH = {
  name: "Sarah Jenkins",
  email: "sarah.jenkins@adminhub.io",
  phone: pick(["+1 (415) 555-0148", "+1 (212) 555-0194", "+1 (646) 555-0172"], random),
  birthDate: pick(["March 14, 1992", "July 2, 1988", "November 23, 1990"], random),
  address: pick(
    [
      "418 Market St, Suite 12, San Francisco, CA",
      "88 Pine St, Floor 4, New York, NY",
      "220 W Illinois St, Chicago, IL",
    ],
    random,
  ),
  displayId: pick(["#USR-0108", "#USR-0042", "#USR-0216"], random),
  joinDate: pick(["Jan 12, 2023", "Mar 4, 2024", "Aug 19, 2022"], random),
  lastActive: pick(["Just now", "2 mins ago", "10 mins ago"], random),
  twoFactor: random() > 0.35,
};

const ACTIVITY = [
  {
    title: "Logged in from Chrome / macOS",
    detail: "IP: 192.168.1.45",
    time: "10 mins ago",
  },
  {
    title: "Updated security settings",
    detail: "Changed master recovery email",
    time: "2 hours ago",
  },
  {
    title: "Approved Transaction #TXN-7823",
    detail: "Value $245.00 approved manually",
    time: "1 day ago",
  },
];

const TRANSACTIONS = [
  { id: "#TXN-7823", date: "Oct 1, 2024", amount: "$245.00" },
  { id: "#TXN-6912", date: "Sep 14, 2024", amount: "$120.00" },
];

function SarahProfile() {
  return (
    <main className="box-border flex min-h-full w-full flex-col gap-6 p-8 max-md:gap-4 max-md:p-4 max-md:pb-20">
      <div className="flex flex-col gap-4">
        <article className="box-border flex h-49.75 w-full flex-col items-center rounded-lg border border-solid border-slate-200 bg-white p-5">
          <Avatar
            size="lg"
            src="/sarah.png"
            alt={SARAH.name}
            className="size-18 rounded-[36px] text-[24px]"
          >
            SJ
          </Avatar>
          <h2 className="mt-3 font-sans text-[18px] font-bold leading-none tracking-normal text-slate-900">
            {SARAH.name}
          </h2>
          <p className="mt-1 font-sans text-[13px] font-normal leading-none tracking-normal text-slate-500">
            {SARAH.email}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex h-5.25 items-center rounded-xl bg-info-light px-2 text-[11px] font-semibold leading-none tracking-normal text-info-dark">
              Super Admin
            </span>
            <StatusBadge status="active" />
          </div>
        </article>

        <article className="box-border flex h-57.25 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
          <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
            Personal Information
          </h3>
          {(
            [
              ["Full Name", SARAH.name],
              ["Email", SARAH.email],
              ["Phone", SARAH.phone],
              ["Date of Birth", SARAH.birthDate],
              ["Address", SARAH.address],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5"
            >
              <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
                {label}
              </span>
              <span className="truncate text-right font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
                {value}
              </span>
            </div>
          ))}
        </article>

        <article className="box-border flex h-57.25 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
          <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
            Account Details
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "User ID", value: SARAH.displayId },
              { label: "Joined Date", value: SARAH.joinDate },
              { label: "Last Login", value: SARAH.lastActive },
              { label: "Role", value: "Super Admin" },
            ].map((row) => (
              <div
                key={row.label}
                className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5"
              >
                <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
                  {row.label}
                </span>
                <span className="text-right font-sans text-[13px] font-medium leading-none tracking-normal text-slate-900">
                  {row.value}
                </span>
              </div>
            ))}
            <div className="box-border flex h-6.5 w-full items-center justify-between border-b border-solid border-slate-200 pb-2.5">
              <span className="shrink-0 font-sans text-[13px] font-medium leading-none tracking-normal text-slate-500">
                2FA Status
              </span>
              <span
                className={`text-right font-sans text-[13px] font-medium leading-none tracking-normal ${SARAH.twoFactor ? "text-success" : "text-slate-500"}`}
              >
                {SARAH.twoFactor ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </article>

        <article className="box-border flex h-58.25 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
          <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
            Recent Activity
          </h3>
          <div className="flex flex-col gap-3">
            {ACTIVITY.map((item, index) => (
              <div key={item.title} className="relative flex gap-3">
                {index < ACTIVITY.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute top-3 -bottom-3 left-0.75 w-px bg-indigo-200"
                  />
                ) : null}
                <span
                  aria-hidden
                  className="relative z-10 mt-1 size-2 shrink-0 rounded-full bg-indigo-600"
                />
                <div className="flex min-w-0 flex-col gap-1.5">
                  <p className="font-sans text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                    {item.title}
                  </p>
                  <p className="font-sans text-[12px] font-normal leading-none tracking-normal text-slate-500">
                    {item.detail}
                  </p>
                  <p className="font-sans text-[11px] font-normal leading-none tracking-normal text-slate-400">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="box-border flex h-36.75 w-full flex-col gap-3 rounded-lg border border-solid border-slate-200 bg-white p-4">
          <h3 className="font-sans text-[14px] font-bold leading-none tracking-normal text-slate-900">
            Recent Transactions
          </h3>
          <div className="flex flex-col gap-3">
            {TRANSACTIONS.map((transaction) => (
              <div
                key={transaction.id}
                className="box-border flex h-9.75 w-full items-center justify-between border-b border-solid border-slate-200 pb-2"
              >
                <div className="flex min-w-0 flex-col gap-1.5">
                  <p className="font-sans text-[13px] font-semibold leading-none tracking-normal text-slate-900">
                    {transaction.id}
                  </p>
                  <p className="font-sans text-[11px] font-normal leading-none tracking-normal text-slate-500">
                    {transaction.date}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-sans text-[13px] font-bold leading-none tracking-normal text-slate-900">
                    {transaction.amount}
                  </span>
                  <StatusBadge status="completed">Success</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
      <MobileTabBar />
    </main>
  );
}

export { SarahProfile };
