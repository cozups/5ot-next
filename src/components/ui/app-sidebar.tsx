"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "./sidebar";
import { Category } from "@/types/category";
import Link from "next/link";
import SearchBar from "../layout/search-bar";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export default function AppSidebar() {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from("category").select().overrideTypes<Category[]>();
      return data;
    },
  });

  return (
    <Sidebar>
      <SidebarHeader className="px-4">
        <SearchBar />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Men</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data
                ?.filter((category) => category.sex === "men")
                .map((menu) => (
                  <SidebarMenuItem key={menu.id}>
                    <Link href={`/${menu.sex}/${menu.name}`} className="block px-2 py-1 hover:bg-gray-100 rounded">
                      {menu.name}
                    </Link>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Women</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data
                ?.filter((category) => category.sex === "women")
                .map((menu) => (
                  <SidebarMenuItem key={menu.id}>
                    <Link href={`/${menu.sex}/${menu.name}`} className="block px-2 py-1 hover:bg-gray-100 rounded">
                      {menu.name}
                    </Link>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
