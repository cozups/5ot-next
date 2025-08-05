import Link from "next/link";
import Image from "next/image";
import { Pacifico } from "next/font/google";
import { ShoppingBasket } from "lucide-react";

import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import SearchBar from "./search-bar";
import LogoutButton from "./logout-button";
import CartCount from "./ui/cart-count";
import { cn } from "@/lib/utils";

const FontPacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

export default async function MainHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const { user } = data;

  return (
    <div className={cn("w-full h-16 flex justify-between items-center px-8", "lg:h-20")}>
      <div className={cn("flex items-end gap-3", "md:gap-6")}>
        <h1
          className={cn(
            FontPacifico.className,
            "hover:text-neutral-500 transition-colors duration-100 text-black text-2xl",
            "lg:text-4xl"
          )}
        >
          <Link href="/">5ot</Link>
        </h1>
        <SearchBar />
      </div>
      {!user && (
        <nav>
          <ul className={cn("flex gap-2 text-black text-xs", "md:text-sm", "lg:text-base")}>
            <li>
              <Link href="/login">로그인</Link>
            </li>
            <li>
              <Link href="/join">회원가입</Link>
            </li>
          </ul>
        </nav>
      )}
      {user && (
        <div className={cn("flex items-center gap-1", "md:gap-2")}>
          {/* 유저 프로필 & 마이페이지 링크 */}
          <Link href="/mypage" className="mr-4">
            <div className={cn("flex gap-1 items-center", "md:gap-2")}>
              <div className="w-8 h-8 rounded-full  overflow-hidden relative">
                <Image
                  src={user.user_metadata.image || "/images/user.png"}
                  fill
                  className="w-full object-cover"
                  alt="user profile image"
                />
              </div>
              <p className="text-sm md:text-base">{user.user_metadata.username}</p>
            </div>
          </Link>
          {/* 장바구니 & 로그아웃 버튼 */}
          <Link href="/cart">
            <div className="relative">
              <CartCount />
              <Button className="flex items-center gap-2 cursor-pointer bg-blue-300 hover:bg-blue-400">
                <ShoppingBasket />
                <span className="hidden md:inline">장바구니</span>
              </Button>
            </div>
          </Link>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
