"use client";

import { Button } from "../ui";

export default function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-bold">데이터를 불러오는 중 에러가 발생했습니다.</h2>
      <p>Cause: {error?.message}</p>
      <Button onClick={resetErrorBoundary}>다시 시도하기</Button>
    </div>
  );
}
