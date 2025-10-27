"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useCategory } from "@/features/category/hooks/use-category";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent } from "../ui/menubar";

export default function TopMenu({ className }: { className?: string }) {
  const { men, women } = useCategory();

  return (
    <Menubar className={cn("flex justify-center items-center gap-8 border-0 shadow-none", className)}>
      <MenubarMenu>
        <MenubarTrigger className="font-bold cursor-pointer">Men</MenubarTrigger>
        <MenubarContent>
          <ul>
            {men.map((menu) => (
              <li key={menu.id}>
                <Link href={`/category/${menu.id}`} className="block px-2 py-1 hover:bg-gray-100 rounded">
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="font-bold cursor-pointer">Women</MenubarTrigger>
        <MenubarContent>
          <ul>
            {women.map((menu) => (
              <li key={menu.id}>
                <Link href={`/category/${menu.id}`} className="block px-2 py-1 hover:bg-gray-100 rounded">
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
