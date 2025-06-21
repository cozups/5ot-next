import { supabaseAdmin } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';

type ExtendedUserListData = {
  users: User[];
  aud: string;
  nextPage: string | null;
  lastPage: number;
  total: number;
};
export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userListData } = await supabaseAdmin.auth.admin.listUsers();
  const total = (userListData as ExtendedUserListData).total;
  const { data: orders } = await supabase.from('orders').select();
  const orderProcessRate =
    (orders &&
      orders?.length > 0 &&
      (orders.filter((order) => order.status === 'done').length /
        orders.length) *
        100) ||
    0;

  return (
    <div className="min-h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold">관리자 페이지</h1>
      <div className="py-4">
        <div className="grid grid-cols-3 gap-4">
          {/* 총 회원 수 */}
          <div className="h-36 bg-gray-100 rounded-2xl p-4 flex flex-col justify-between">
            <h2 className="text-xl font-semibold">회원 수</h2>
            <p className="text-4xl font-bold self-end">{total}</p>
          </div>
          {/* 총 주문 수 */}
          <div className="h-36 bg-gray-100 rounded-2xl px-6 py-4 flex flex-col justify-between">
            <h2 className="text-xl font-semibold">총 주문</h2>
            <p className="text-4xl font-bold self-end">{orders?.length || 0}</p>
          </div>
          {/* 주문 처리율 */}
          <div className="h-36 bg-gray-100 rounded-2xl px-6 py-4 flex flex-col justify-between">
            <h2 className="text-xl font-semibold">주문 처리율</h2>
            <p className="text-4xl font-bold self-end">
              {orderProcessRate.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* TODO: 후기 및 문의 */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* 후기 */}
          <div className="h-96 bg-gray-100 rounded-2xl p-4 flex flex-col justify-between">
            <h2 className="text-xl font-semibold">최근 후기</h2>
            <p className="text-4xl font-bold self-end">{total}</p>
          </div>
          {/* 문의 */}
          <div className="h-96 bg-gray-100 rounded-2xl p-4 flex flex-col justify-between">
            <h2 className="text-xl font-semibold">문의</h2>
            <p className="text-4xl font-bold self-end">{total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
