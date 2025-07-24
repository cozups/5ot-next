'use client';

import { getUserList } from '@/actions/auth';
import { Pagination, User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'sonner';
import UserItemSkeleton from '../skeleton/user-item-skeleton';

export default function UserList({
  initialData,
}: {
  initialData:
    | ({
        users: User[];
        aud: string;
      } & Pagination)
    | {
        users: [];
      };
}) {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['user-list'],
    queryFn: getUserList,
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    toast.error('회원 리스트를 불러오던 중 문제가 발생했습니다.', {
      description: error.message,
    });
  }
  console.log(isLoading);

  return (
    <div className="mt-4 flex flex-col gap-2 overflow-auto">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <UserItemSkeleton key={`user-${i}`} />
        ))}
      {isSuccess &&
        data?.users?.map((user: User) => (
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
  );
}
