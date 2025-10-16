import { cn } from "@/lib/utils";

export default function AdminLayout({
  statistics,
  users,
  reviews,
}: {
  statistics: React.ReactNode;
  users: React.ReactNode;
  reviews: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold my-2">관리자 페이지</h1>
      <div className="py-4">
        {/* 총 주문 */}
        {statistics}

        <div className={cn("grid grid-cols-1 gap-4 mt-4", "lg:grid-cols-2")}>
          {/* 총 회원 수 */}
          {users}

          {/* 후기 */}
          {reviews}
        </div>
      </div>
    </div>
  );
}
