import { redirect } from "next/navigation";

import DeleteUserDialog from "@/components/delete-user-dialog";
import { getUser } from "@/actions/auth";

export const generateMetadata = async () => {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return {
    title: `${user.user_metadata.username} | 5ot Next`,
    description: `${user.user_metadata.username}의 마이페이지 입니다.`,
  };
};

export default async function MyPageLayout({ profile, orders }: { profile: React.ReactNode; orders: React.ReactNode }) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      {/* 프로필 영역 */}
      <div className="flex gap-8 rounded-2xl p-4 bg-slate-100">{profile}</div>

      {/* 구매 내역 */}
      <h2 className="text-2xl font-bold my-6">구매 내역</h2>
      <div className="min-h-96">{orders}</div>

      <DeleteUserDialog user={user} />
    </div>
  );
}
