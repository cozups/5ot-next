import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { cn } from "@/lib/utils";
import UserList from "@/components/admin/user-list";
import { getUser } from "@/actions/auth";
import ReviewList from "@/components/product/review-list";
import { UserProvider } from "@/store/user";
import OrderStatistics from "@/components/order/order-statistics";
import UserListSkeleton from "@/components/skeleton/user-list-skeleton";
import ErrorFallback from "@/components/error-fallbacks/error-fallback";
import ReviewListSkeleton from "@/components/skeleton/review-list-skeleton";

export const metadata = {
  title: "관리자 페이지 | 5ot Next",
  description: "관리자 페이지 입니다.",
};

export default async function AdminPage() {
  const user = await getUser();

  return (
    <div className="min-h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold my-2">관리자 페이지</h1>
      <div className="py-4">
        {/* 총 주문 */}
        <OrderStatistics />

        <div className={cn("grid grid-cols-1 gap-4 mt-4", "lg:grid-cols-2")}>
          {/* 총 회원 수 */}
          <div className="h-96 bg-gray-100 rounded-2xl p-4 flex flex-col">
            <h2 className="text-xl font-semibold">회원</h2>
            <ErrorBoundary fallbackRender={ErrorFallback}>
              <Suspense fallback={<UserListSkeleton />}>
                <UserList />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* 후기 */}
          <div className="h-96 bg-gray-100 rounded-2xl p-4 flex flex-col">
            <h2 className="text-xl font-semibold">최근 리뷰</h2>
            <ErrorBoundary fallbackRender={ErrorFallback}>
              <Suspense fallback={<ReviewListSkeleton />}>
                <UserProvider user={user}>
                  <ReviewList recent />
                </UserProvider>
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
