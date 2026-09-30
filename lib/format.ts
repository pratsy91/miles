type Trend = {
  trend: string;
  variant: "up" | "down" | "neutral";
};

function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

function formatMoney(value: number, digits = 0) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function monthStart(offset = 0) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + offset, 1).getTime();
}

function percentChange(current: number, previous: number): Trend {
  if (previous === 0 && current === 0) {
    return { trend: "0.0%", variant: "neutral" };
  }

  if (previous === 0) {
    return { trend: "100%", variant: current > 0 ? "up" : "neutral" };
  }

  const delta = ((current - previous) / Math.abs(previous)) * 100;
  if (Math.abs(delta) < 0.05) {
    return { trend: "0.0%", variant: "neutral" };
  }

  return {
    trend: `${Math.abs(delta).toFixed(1)}%`,
    variant: delta > 0 ? "up" : "down",
  };
}

export { formatCount, formatMoney, monthStart, percentChange };
export type { Trend };
