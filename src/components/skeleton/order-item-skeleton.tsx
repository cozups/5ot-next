import { TableBody, TableRow, TableCell } from "../ui";
import { Skeleton } from "../ui/skeleton";

export default function OrderItemSkeleton() {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-8 rounded w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 rounded w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 rounded w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 rounded w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 rounded w-full" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
