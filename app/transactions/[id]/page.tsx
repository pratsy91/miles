import { TransactionDetailScreen } from "@/components/transactions/transaction-detail-screen";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TransactionDetailScreen id={id} />;
}
