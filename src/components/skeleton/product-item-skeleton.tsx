import { Skeleton } from '../ui/skeleton';

export default function ProductItemSkeleton() {
  return (
    <div className="cursor-pointer transition-scale duration-200 hover:scale-105">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <Skeleton className="w-full h-6 mt-2" />
      <Skeleton className="w-1/2 h-5 mt-2" />
      <div className="flex justify-between mt-3">
        <Skeleton className="w-1/3 h-5" />
        <Skeleton className="w-1/3 h-5" />
      </div>
    </div>
  );
}
