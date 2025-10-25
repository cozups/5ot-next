import Link from "next/link";

import { Category } from "@/types/category";
import { createClient } from "@/utils/supabase/server";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui";

export default async function SideBar() {
  const supabase = await createClient();
  const { data } = await supabase.from("category").select().overrideTypes<Category[]>();

  const sideBarContent = (
    <div className="py-2 lg:py-4">
      <div>
        <h2 className="text-2xl my-1 font-semibold">Men</h2>
        <ul>
          {data
            ?.filter((category) => category.sex === "men")
            .map((menu) => (
              <li key={menu.id}>
                <Link href={`/${menu.sex}/${menu.name}`}>{menu.name}</Link>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <h2 className="text-2xl my-1 font-semibold">Woman</h2>
        <ul>
          {data
            ?.filter((category) => category.sex === "women")
            .map((menu) => (
              <li key={menu.id}>
                <Link href={`/${menu.sex}/${menu.name}`}>{menu.name}</Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* 데스크탑: 일반 사이드바 */}
      <div className="hidden lg:block lg:pl-8 ">{sideBarContent}</div>
      {/* 모바일/패드: 아코디언 */}
      <Accordion type="single" className="lg:hidden" collapsible>
        <AccordionItem value="menu">
          <AccordionTrigger className="pt-0 pb-4 font-bold">Menu</AccordionTrigger>
          <AccordionContent>{sideBarContent}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
