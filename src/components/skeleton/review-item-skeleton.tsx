import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export default function ReviewItemSkeleton({
  recent = false,
}: {
  recent?: boolean;
}) {
  return (
    <div className={cn('w-full', recent && 'bg-white rounded-xl p-2')}>
      <Skeleton className="w-1/5 h-5" />
      <Skeleton className="w-full h-16 mt-2" />
    </div>
  );
}
