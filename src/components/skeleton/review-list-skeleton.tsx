import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

function ReviewItemSkeleton({ recent = false }: { recent?: boolean }) {
  return (
    <div className={cn("w-full", recent && "bg-white rounded-xl p-2")}>
      <Skeleton className="w-1/5 h-5" />
      <Skeleton className="w-full h-16 mt-2" />
    </div>
  );
}

export default function ReviewListSkeleton({ recent = false }: { recent?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-6 text-xs", !recent && "mt-8", "md:text-sm", "lg:text-base")}>
      {Array.from({ length: 2 }).map((_, i) => (
        <ReviewItemSkeleton key={`review-${i}`} recent={recent} />
      ))}
    </div>
  );
}
