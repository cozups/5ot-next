import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import { getUser } from "@/features/auth/queries";
import DeleteUserDialog from "@/features/auth/ui/delete-user-dialog";
import RecentViewedProducts from "@/features/product/components/recent-viewed-products";

export const generateMetadata = async () => {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  if (!user) {
    return null;
  }

  return {
    title: `${user.user_metadata.username} | 5ot Next`,
    description: `${user.user_metadata.username}의 마이페이지 입니다.`,
  };
};

export default async function MyPageLayout({ profile, orders }: { profile: React.ReactNode; orders: React.ReactNode }) {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

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

      {/* 최근 본 상품 */}
      <RecentViewedProducts />

      {/* 회원 탈퇴 */}
      <DeleteUserDialog user={user} />
    </div>
  );
}
