import type { StoredTransaction } from "@/lib/transactions-store";

const COLUMNS = [
  "Transaction ID",
  "User",
  "Email",
  "Type",
  "Amount",
  "Status",
  "Date",
  "Method",
  "Reference",
  "Description",
] as const;

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cells(transaction: StoredTransaction) {
  return [
    transaction.id,
    transaction.name,
    transaction.email,
    transaction.type,
    transaction.amount,
    transaction.status,
    transaction.dateTime,
    transaction.method,
    transaction.reference,
    transaction.description,
  ];
}

function downloadTransactionsCsv(transactions: StoredTransaction[], filename = "transactions.csv") {
  const lines = [
    COLUMNS.join(","),
    ...transactions.map((transaction) => cells(transaction).map(escapeCsv).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function printHtml(title: string, body: string) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;width:0;height:0;border:0;";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  if (!doc) {
    frame.remove();
    return;
  }

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
  <head>
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: Inter, Arial, sans-serif; color: #0f172a; padding: 32px; }
      h1 { font-size: 20px; margin: 0 0 16px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: 8px 12px 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; vertical-align: top; }
      th { color: #64748b; font-weight: 600; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    ${body}
  </body>
</html>`);
  doc.close();
  frame.contentWindow?.focus();
  frame.contentWindow?.print();
  window.setTimeout(() => frame.remove(), 1000);
}

function printTransactions(transactions: StoredTransaction[]) {
  const head = COLUMNS.map((column) => `<th>${column}</th>`).join("");
  const body = transactions
    .map((transaction) => {
      const row = cells(transaction)
        .map((value) => `<td>${escapeHtml(value)}</td>`)
        .join("");
      return `<tr>${row}</tr>`;
    })
    .join("");

  printHtml(
    "Transactions",
    `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`,
  );
}

function printTransaction(transaction: StoredTransaction) {
  const rows = [
    ["Transaction", transaction.id],
    ["Customer", `${transaction.name} · ${transaction.email}`],
    ["Type", transaction.type],
    ["Description", transaction.description],
    ["Amount", transaction.amount],
    ["Fee", transaction.fee],
    ["Status", transaction.status],
    ["Method", transaction.method],
    ["Reference", transaction.reference],
    ["Date", transaction.dateTime],
  ]
    .map(
      ([label, value]) =>
        `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  printHtml(`Receipt ${transaction.id}`, `<table>${rows}</table>`);
}

export { downloadTransactionsCsv, printTransaction, printTransactions };
