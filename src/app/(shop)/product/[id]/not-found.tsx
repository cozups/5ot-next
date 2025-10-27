"use client";

import { Button } from "@/components/ui";
import { usePathname, useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const url = usePathname();
  const parentPath = url.split("/").slice(0, -1).join("/");

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col justify-center items-center gap-8">
      <h1 className="text-3xl font-black">존재하지 않는 상품입니다.</h1>
      <Button className="cursor-pointer" onClick={() => router.replace(parentPath)}>
        목록으로 돌아가기
      </Button>
    </div>
  );
}
