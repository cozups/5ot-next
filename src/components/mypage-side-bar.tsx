"use client";

import { cn } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideBarItem {
  title: string;
  link: string;
}

export default function MyPageSideBar() {
  const pathname = usePathname();
  let mode: "normal" | "admin" = "normal";

  if (pathname.startsWith("/admin")) {
    mode = "admin";
  }

  const menus = {
    admin: [
      { title: "메인 대시보드", link: "/admin" },
      { title: "주문 관리", link: "/admin/order" },
      { title: "카테고리 관리", link: "/admin/category" },
      { title: "제품 관리", link: "/admin/product" },
    ],
    normal: [{ title: "내 정보", link: "/mypage" }],
  };

  return (
    <div className={cn("flex gap-2 text-xs", "md:text-sm", "lg:text-base")}>
      {menus[mode].map((menu: SideBarItem) => (
        <div
          key={menu.title}
          className={clsx(
            "rounded mb-2",
            pathname === menu.link ? "bg-blue-200 hover:bg-blue-300" : "hover:bg-slate-100"
          )}
        >
          <Link href={menu.link} className="w-full block px-2 py-2">
            {menu.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
