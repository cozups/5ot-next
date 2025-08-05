import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent } from "./menubar";
import { Category } from "@/types/category";
import { cn } from "@/lib/utils";

export default async function TopMenu({ className }: { className?: string }) {
  const supabase = await createClient();
  const { data } = await supabase.from("category").select().overrideTypes<Category[]>();

  return (
    <Menubar className={cn("flex gap-8 border-0 shadow-none", className)}>
      <MenubarMenu>
        <MenubarTrigger className="font-bold cursor-pointer">Men</MenubarTrigger>
        <MenubarContent>
          <ul>
            {data
              ?.filter((category) => category.sex === "men")
              .map((menu) => (
                <li key={menu.id}>
                  <Link href={`/${menu.sex}/${menu.name}`} className="block px-2 py-1 hover:bg-gray-100 rounded">
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
            {data
              ?.filter((category) => category.sex === "women")
              .map((menu) => (
                <li key={menu.id}>
                  <Link href={`/${menu.sex}/${menu.name}`} className="block px-2 py-1 hover:bg-gray-100 rounded">
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
