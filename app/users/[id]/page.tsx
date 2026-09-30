import { UserDetailScreen } from "@/components/users/user-detail-screen";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserDetailScreen id={id} />;
}
