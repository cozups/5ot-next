import Image from 'next/image';

import { getRecentReviews } from '@/actions/reviews';
import ReviewItem from '@/components/product/review-Item';
import { getOrderProcessRate } from '@/lib/utils';
import { Order } from '@/types/orders';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userListData } = await supabaseAdmin.auth.admin.listUsers();

  const { data: orders } = await supabase
    .from('orders')
    .select()
    .overrideTypes<Order[]>();
  const orderProcessRate = getOrderProcessRate(orders);

  const { data: reviews } = await getRecentReviews(5);

  return (
    <div className="min-h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold">관리자 페이지</h1>
      <div className="py-4">
        {/* 총 주문 */}
        <div className="h-36 bg-gray-100 rounded-2xl px-6 py-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">총 주문</h2>
            <p className="font-semibold">
              처리율 {orderProcessRate.toFixed(2)}%
            </p>
          </div>
          <p className="text-4xl font-bold self-end">{orders?.length || 0}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* 총 회원 수 */}
          <div className="h-96 bg-gray-100 rounded-2xl p-4 flex flex-col">
            <h2 className="text-xl font-semibold">회원</h2>
            <div className="mt-4 flex flex-col gap-2 overflow-auto">
              {userListData.users?.map((user) => (
                <div
                  key={user.id}
                  className="h-12 bg-white rounded-xl flex items-center justify-between p-2 text-sm text-gray-600"
                >
                  <div className="w-1/3 grid grid-cols-3 items-center gap-2">
                    <div className="w-8 h-8 rounded-full relative object-cover overflow-hidden">
                      <Image
                        src={user.user_metadata.image || '/images/user.png'}
                        fill
                        alt={`${user.user_metadata.username} image`}
                      />
                    </div>
                    <p>{user.user_metadata.username}</p>
                    <p className="text-xs">{user.user_metadata.email}</p>
                  </div>
                  <p>{user.user_metadata.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 후기 */}
          <div className="h-96 bg-gray-100 rounded-2xl p-4 flex flex-col justify-between">
            <h2 className="text-xl font-semibold">최근 리뷰</h2>
            <ul className="mt-4 flex flex-col gap-2 overflow-auto">
              {reviews?.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  className="bg-white"
                  showProducts
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
