import { getRecentReviews } from "@/actions/reviews";
import { cn, getOrderProcessRate } from "@/lib/utils";
import { Order } from "@/types/orders";
import { createClient } from "@/utils/supabase/server";
import UserList from "@/components/admin/user-list";
import { getUserList } from "@/actions/auth";
import ReviewList from "@/components/product/review-list";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userListData } = await getUserList();

  const { data: orders } = await supabase.from("orders").select().overrideTypes<Order[]>();
  const orderProcessRate = getOrderProcessRate(orders);

  const { data: reviews } = await getRecentReviews(5);

  return (
    <div className="min-h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold my-2">관리자 페이지</h1>
      <div className="py-4">
        {/* 총 주문 */}
        <div className="h-36 bg-gray-100 rounded-2xl px-6 py-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">총 주문</h2>
            <p className="font-semibold">처리율 {orderProcessRate.toFixed(2)}%</p>
          </div>
          <p className="text-4xl font-bold self-end">{orders?.length || 0}</p>
        </div>

        <div className={cn("grid grid-cols-1 gap-4 mt-4", "lg:grid-cols-2")}>
          {/* 총 회원 수 */}
          <div className="h-96 bg-gray-100 rounded-2xl p-4 flex flex-col">
            <h2 className="text-xl font-semibold">회원</h2>
            <UserList initialData={userListData} />
          </div>

          {/* 후기 */}
          <div className="h-96 bg-gray-100 rounded-2xl p-4 flex flex-col">
            <h2 className="text-xl font-semibold">최근 리뷰</h2>
            <div className="mt-4 flex flex-col gap-2 overflow-auto">
              <ReviewList initialData={{ data: reviews, count: 0 }} recent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
