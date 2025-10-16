import { cn } from "@/lib/utils";
import { TableBody, TableRow, TableCell, Table, TableHeader, TableHead } from "../ui";
import { Skeleton } from "../ui/skeleton";

function OrderItemSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-12 rounded w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-12 rounded w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-12 rounded w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-12 rounded w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-12 rounded w-full" />
      </TableCell>
    </TableRow>
  );
}

export default function OrderListSkeleton() {
  return (
    <Table className={cn("text-xs", "lg:text-sm")}>
      <TableHeader>
        <TableRow>
          <TableHead>주문자</TableHead>
          <TableHead>상품</TableHead>
          <TableHead>배송 정보</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>관리</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <OrderItemSkeleton key={i} />
        ))}
      </TableBody>
    </Table>
  );
}
