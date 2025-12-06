"use client";

import Image from "next/image";
import Link from "next/link";

import { useUser } from "@/hooks/use-users";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import LogoutButton from "@/features/auth/ui/logout-button";
import { toast } from "sonner";
import { useEffect } from "react";
import { getCartDataFromDB } from "@/features/cart/queries";
import { createClient } from "@/utils/supabase/client";
import { arrangeCartData } from "@/lib/arrange-cart-data";
import { useCartStore } from "@/store/cart";

export default function AuthSection() {
  const { user, isLoading } = useUser();
  const { data: localCartData, setItem } = useCartStore();

  useEffect(() => {
    async function fetchCartData() {
      // DB에서 장바구니 데이터 불러오기
      const supabase = createClient();
      const { data: fetchedData, errors } = await getCartDataFromDB(supabase, user!.id);

      if (errors) {
        toast.error("장바구니 데이터를 불러오는 중 오류가 발생했습니다.", { description: errors.message });
        return;
      }

      // 로컬 스토리지와 병합
      const finalCartData = arrangeCartData(fetchedData, localCartData);
      setItem(finalCartData);

      // 병합된 데이터로 DB 데이터 동기화
      const cartDataForDB = finalCartData.map((item) => ({
        product: item.product,
        qty: item.qty,
      }));

      const { error } = await supabase.from("profiles").update({ cart: cartDataForDB }).eq("id", user!.id);

      if (error) {
        toast.error("장바구니 데이터 업데이트에 실패했습니다. 다시 시도해주세요.");
      }

      localStorage.removeItem("cart-storage");
    }

    if (user) {
      fetchCartData();
    }
  }, [user, setItem]);

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
                  alt={`${user.user_metadata.username}님의 프로필 이미지`}
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
