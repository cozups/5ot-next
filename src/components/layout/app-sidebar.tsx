"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import SearchBar from "./search-bar";
import { useCategory } from "@/features/category/hooks/use-category";

export default function AppSidebar() {
  const { men, women } = useCategory();
  const { toggleSidebar } = useSidebar();

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
              {men.map((menu) => (
                <SidebarMenuItem key={menu.id}>
                  <SidebarMenuButton onClick={toggleSidebar} asChild>
                    <Link href={`/category/${menu.id}`} className="block px-2 py-1 hover:bg-gray-100 rounded">
                      {menu.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Women</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {women.map((menu) => (
                <SidebarMenuItem key={menu.id}>
                  <SidebarMenuButton onClick={toggleSidebar} asChild>
                    <Link href={`/category/${menu.id}`} className="block px-2 py-1 hover:bg-gray-100 rounded">
                      {menu.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
