import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

function UserItemSkeleton() {
  return (
    <div className="h-12 bg-white rounded-xl p-2 flex items-center justify-between">
      <div className="w-1/3 grid grid-cols-[2rem_4rem_12rem] items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
      </div>
      <Skeleton className="w-1/6 h-8" />
    </div>
  );
}

export default function UserListSkeleton() {
  return (
    <div className={cn("flex flex-col gap-2")}>
      {Array.from({ length: 3 }).map((_, i) => (
        <UserItemSkeleton key={`user-${i}`} />
      ))}
    </div>
  );
}
