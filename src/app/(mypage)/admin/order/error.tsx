"use client";

import { Button } from "@/components/ui";

export default function OrderManagementError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold my-2">주문 관리</h1>
      <div className="min-h-96 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">데이터를 불러오는 중 오류가 발생하였습니다.</h2>
        <p>Cause: {error.message}</p>
        <Button onClick={() => reset()}>다시 시도하기</Button>
      </div>
    </div>
  );
}
