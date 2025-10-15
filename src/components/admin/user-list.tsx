"use client";

import { User } from "@supabase/supabase-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { supabaseAdmin } from "@/utils/supabase/admin";

export default function UserList() {
  const { data } = useSuspenseQuery({
    queryKey: ["user-list"],
    queryFn: async () => {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="mt-4 flex flex-col gap-2 overflow-auto">
      {data?.users?.map((user: User) => (
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
