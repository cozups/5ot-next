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

const GROUP_SIZE = 10;

export default function CustomPagination({ currentPage, totalPage }: CustomPaginationProps) {
  const groupIndex = Math.floor((currentPage - 1) / GROUP_SIZE);

  const getPaginationList = () => {
    const startPage = groupIndex * GROUP_SIZE + 1;
    const endPage = Math.min(startPage + GROUP_SIZE - 1, totalPage);

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
        {groupIndex < Math.floor(totalPage / GROUP_SIZE) && <PaginationNext href={`?page=${paginationList[9] + 1}`} />}
      </PaginationContent>
    </Pagination>
  );
}
