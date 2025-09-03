import Image from "next/image";
import { redirect } from "next/navigation";

import { cn, parseToKorTime } from "@/lib/utils";
import OrderList from "@/components/order/order-list";
import DeleteUserDialog from "@/components/delete-user-dialog";
import UpdateProfileDialog from "@/components/update-profile-dialog";
import { getOrdersByUserId } from "@/actions/orders";
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

export default async function MyPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: orderList } = await getOrdersByUserId(user.id);

  return (
    <div>
      {/* 프로필 영역 */}
      <div className="flex gap-8 rounded-2xl p-4 bg-slate-100">
        <div className={cn("w-24 h-24 rounded-full relative overflow-hidden", "md:w-48 md:h-48")}>
          <Image
            src={user?.user_metadata.image || "/images/user.png"}
            fill
            alt="profile image"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="mb-8">
            <p className={cn("text-base font-bold", "md:text-2xl")}>{user?.user_metadata.username}</p>
            <p className={cn("text-xs text-gray-500 mt-1", "md:text-base")}>{user?.email}</p>
            <p className={cn("text-gray-500 mt-1 text-xs", "md:text-sm")}>가입일: {parseToKorTime(user.created_at)}</p>
          </div>
          <div className="self-end">
            <UpdateProfileDialog user={user} />
          </div>
        </div>
      </div>

      {/* 구매 내역 */}
      <h2 className="text-2xl font-bold my-6">구매 내역</h2>
      <div className="min-h-96">
        <OrderList initialData={orderList} />
      </div>

      <DeleteUserDialog user={user} />
    </div>
  );
}
