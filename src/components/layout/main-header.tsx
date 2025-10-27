import Link from "next/link";
import { Pacifico } from "next/font/google";
import { ShoppingBasket } from "lucide-react";

import { Button } from "../ui/button";
import SearchBar from "./search-bar";
import CartCount from "../ui/cart-count";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";
import AuthSection from "./auth-section";
import dynamic from "next/dynamic";

const FontPacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

const TopMenu = dynamic(() => import("./top-menu"));

export default async function MainHeader() {
  return (
    <div className={cn("w-full h-16 flex justify-between items-center px-8", "lg:h-20")}>
      {/* 타이틀 및 검색바 */}
      <div className={cn("w-[30%] flex items-center gap-3", "md:gap-6")}>
        <SidebarTrigger className="lg:hidden" />
        <h1
          className={cn(
            FontPacifico.className,
            "hover:text-neutral-500 transition-colors duration-100 text-black text-2xl",
            "lg:text-4xl"
          )}
        >
          <Link href="/">5ot</Link>
        </h1>
        <SearchBar className="hidden lg:block" />
      </div>
      {/* 메뉴 */}
      <TopMenu className="hidden lg:flex lg:w-[40%]" />
      {/* 로그인/회원가입, 장바구니, 유저 프로필 */}
      <div className={cn("lg:w-[30%] flex justify-end items-center gap-2")}>
        <Link href="/cart">
          <div className="relative">
            <CartCount />
            <Button className="flex items-center gap-2 cursor-pointer bg-blue-300 hover:bg-blue-400">
              <ShoppingBasket />
              <span className="hidden md:inline">장바구니</span>
            </Button>
          </div>
        </Link>
        <AuthSection />
      </div>
    </div>
  );
}
