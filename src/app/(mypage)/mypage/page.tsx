import Image from 'next/image';
import { redirect } from 'next/navigation';

import { parseToKorTime } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';
import OrderList from '@/components/order/order-list';
import DeleteUserDialog from '@/components/delete-user-dialog';
import UpdateProfileDialog from '@/components/update-profile-dialog';

export default async function MyPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/login');
  }

  const { data: orderList } = await supabase
    .from('orders')
    .select(`*, profiles:user_id (name)`)
    .order('created_at', { ascending: true })
    .eq('user_id', data.user.id);

  return (
    <div>
      {/* 프로필 영역 */}
      <h1 className="text-3xl font-bold mb-8">내 정보</h1>
      <div className="flex gap-8 rounded-2xl p-4 bg-slate-100">
        <div className="w-48 h-48 rounded-full relative overflow-hidden">
          <Image
            src={data.user?.user_metadata.image || '/images/user.png'}
            fill
            alt="profile image"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <p className="text-2xl font-bold">
              {data.user?.user_metadata.username}
            </p>
            <p className="text-gray-500 mt-1">{data.user?.email}</p>
            <p className="text-gray-500 mt-1 text-sm">
              가입일: {parseToKorTime(data.user.created_at)}
            </p>
          </div>
          <div className="self-end">
            <UpdateProfileDialog user={data.user} />
          </div>
        </div>
      </div>

      {/* 구매 내역 */}
      <h2 className="text-2xl font-bold my-6">구매 내역</h2>
      <div className="min-h-48">
        <OrderList role="normal" list={orderList} />
      </div>

      <DeleteUserDialog user={data.user} />
    </div>
  );
}
