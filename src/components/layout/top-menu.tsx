"use client";

import { cn } from "@/lib/utils";
import { useCategory } from "@/features/category/hooks/use-category";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "../ui/menubar";
import { useRouter } from "next/navigation";

export default function TopMenu({ className }: { className?: string }) {
  const { men, women } = useCategory();
  const router = useRouter();

  return (
    <Menubar className={cn("flex justify-center items-center gap-8 border-0 shadow-none", className)}>
      <MenubarMenu>
        <MenubarTrigger className="font-bold cursor-pointer">Men</MenubarTrigger>
        <MenubarContent>
          {men.map((menu) => (
            <MenubarItem
              key={menu.id}
              onClick={() => router.push(`/category/${menu.id}`)}
              className="block px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              {menu.name}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="font-bold cursor-pointer">Women</MenubarTrigger>
        <MenubarContent>
          {women.map((menu) => (
            <MenubarItem
              key={menu.id}
              onClick={() => router.push(`/category/${menu.id}`)}
              className="block px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              {menu.name}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
