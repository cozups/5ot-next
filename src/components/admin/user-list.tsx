"use client";

import { getUserList } from "@/actions/auth";
import { Pagination, User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";
import UserItemSkeleton from "../skeleton/user-item-skeleton";
import { cn } from "@/lib/utils";

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
    queryKey: ["user-list"],
    queryFn: getUserList,
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    toast.error("회원 리스트를 불러오던 중 문제가 발생했습니다.", {
      description: error.message,
    });
  }
  console.log(isLoading);

  return (
    <div className="mt-4 flex flex-col gap-2 overflow-auto">
      {isLoading && Array.from({ length: 3 }).map((_, i) => <UserItemSkeleton key={`user-${i}`} />)}
      {isSuccess &&
        data?.users?.map((user: User) => (
          <div
            key={user.id}
            className={cn(
              "h-12 bg-white rounded-xl flex items-center justify-between p-2 text-xs text-gray-600",
              "md:text-sm"
            )}
          >
            <div className="grid grid-cols-[1fr_2fr_5fr] items-center gap-3">
              <div className={cn("w-6 h-6 rounded-full relative object-cover overflow-hidden", "md:w-8 md:h-8")}>
                <Image
                  src={user.user_metadata.image || "/images/user.png"}
                  fill
                  alt={`${user.user_metadata.username} image`}
                  sizes="5vw"
                />
              </div>
              <p>{user.user_metadata.username}</p>
              <p>{user.user_metadata.email}</p>
            </div>
            <p>{user.user_metadata.role}</p>
          </div>
        ))}
    </div>
  );
}
