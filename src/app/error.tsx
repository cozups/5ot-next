"use client";

import { Button } from "@/components/ui";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">에러가 발생했습니다.</h1>
      <div className="text-center my-8">
        <p>Cause: {error.message}</p>
        <p>잠시 후 다시 시도해 주세요.</p>
      </div>
      <Button onClick={reset} className="cursor-pointer">
        다시 시도하기
      </Button>
    </div>
  );
}
