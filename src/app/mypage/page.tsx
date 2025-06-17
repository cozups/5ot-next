import { parseToKorTime } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MyPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/login');
  }

  return (
    <div>
      {/* 프로필 영역 */}
      <h1 className="text-3xl font-bold mb-8">내 정보</h1>
      <div className="flex gap-8 rounded-2xl p-4">
        <div className="w-48 h-48 rounded-full bg-black"></div>
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
            <button>프로필 수정</button>
          </div>
        </div>
      </div>

      {/* 구매 내역 */}
      <h2 className="text-2xl font-bold my-6">구매 내역</h2>
      <div>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded shadow-md p-2">
            {i}
          </div>
        ))}
      </div>

      <div>
        <button>회원 탈퇴하기</button>
      </div>
    </div>
  );
}
