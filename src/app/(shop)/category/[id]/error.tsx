"use client";

import { Button } from "@/components/ui";

export default function ProductListError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-96 flex flex-col items-center justify-center gap-8">
      <h2 className="text-2xl font-bold my-4 text-red-500">제품을 불러오는 중 에러가 발생했습니다.</h2>
      <div className="text-center">
        <p>Cause: {error.message}</p>
        <p>잠시 후 다시 시도해주세요.</p>
      </div>
      <Button onClick={reset}>다시 시도하기</Button>
    </div>
  );
}
