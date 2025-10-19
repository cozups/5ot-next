"use client";

import Image from "next/image";
import Link from "next/link";

import { useUser } from "@/hooks/use-users";
import { cn } from "@/lib/utils";
import LogoutButton from "../logout-button";
import { Skeleton } from "../ui/skeleton";

export default function AuthSection() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-1", "md:gap-2")}>
        <div className={cn("flex gap-1 items-center", "md:gap-2")}>
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-12 md:w-16" />
        </div>
        <Skeleton className="h-9 w-9 md:w-22" />
      </div>
    );
  }

  return (
    <div>
      {!user && (
        <nav>
          <ul className={cn("flex gap-2 text-black text-xs", "md:text-sm", "lg:text-base")}>
            <li>
              <Link href="/login">로그인</Link>
            </li>
            <li className="hidden md:block">
              <Link href="/join">회원가입</Link>
            </li>
          </ul>
        </nav>
      )}
      {user && (
        <div className={cn("flex items-center gap-1", "md:gap-2")}>
          {/* 유저 프로필 & 마이페이지 링크 */}
          <Link href="/mypage" className="hover:bg-gray-100 rounded px-2 py-1">
            <div className={cn("flex gap-1 items-center", "md:gap-2")}>
              <div className="w-8 h-8 rounded-full  overflow-hidden relative">
                <Image
                  src={user.user_metadata.image || "/images/user.png"}
                  fill
                  className="w-full object-cover"
                  alt="user profile image"
                  sizes="5vw"
                />
              </div>
              <p className="text-sm md:text-base">{user.user_metadata.username}</p>
            </div>
          </Link>
          {/* 로그아웃 버튼 */}
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
