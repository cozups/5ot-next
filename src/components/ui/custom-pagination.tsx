import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  currentPage: number;
  totalPage: number;
}

export default function CustomPagination({ currentPage, totalPage }: CustomPaginationProps) {
  const groupSize = 10;
  const groupIndex = Math.floor((currentPage - 1) / groupSize);

  const getPaginationList = () => {
    const startPage = groupIndex * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPage);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const paginationList = getPaginationList();

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {groupIndex > 0 && <PaginationPrevious href={`?page=${paginationList[0] - 1}`} />}
        {paginationList.map((pageNum: number) => (
          <PaginationItem key={`page-${pageNum}`}>
            <PaginationLink href={`?page=${pageNum}`} isActive={pageNum === currentPage}>
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}
        {groupIndex < Math.floor(totalPage / groupSize) && <PaginationNext href={`?page=${paginationList[9] + 1}`} />}
      </PaginationContent>
    </Pagination>
  );
}
