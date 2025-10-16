import ReviewList from "@/components/product/review-list";

export default async function ReviewListPage() {
  return (
    <div className="h-96 bg-gray-100 rounded-2xl p-4 flex flex-col">
      <h2 className="text-xl font-semibold">최근 리뷰</h2>
      <ReviewList recent />
    </div>
  );
}
