"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useDebounceSearch } from "@/hooks/use-debounce-search";
import { useSidebar } from "../ui/sidebar";

export default function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>("");
  const { searchResults, setSearchResults } = useDebounceSearch(searchWord, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toggleSidebar, isMobile } = useSidebar();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.trim().length === 0) {
      setSearchResults([]);
    }

    setSearchWord(value);
    setIsOpen(true);
  };

  const onClickResult = (productId: string) => {
    router.push(`/product/${productId}`);

    // 검색어 초기화
    if (inputRef.current) {
      inputRef.current.value = "";
      setSearchWord("");
      setSearchResults([]);
    }

    // 모바일인 경우, 사이드바 닫기
    if (isMobile) {
      toggleSidebar();
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* 검색 바 */}
      <div className={cn("flex items-end gap-1", "md:gap-2")}>
        <Search className={cn("w-3 text-gray-500", "md:w-4")} />
        <input
          type="text"
          className={cn("border-b border-b-gray-400 w-full", "lg:w-36")}
          ref={inputRef}
          onChange={onInputChange}
          onClick={() => setIsOpen(true)}
        />
      </div>

      {/* 검색 결과 */}
      <div
        className={cn(
          "absolute z-10 top-8 left-0 shadow w-64 p-1 max-h-[32rem] bg-white overflow-auto text-sm",
          isOpen ? "block" : "hidden"
        )}
      >
        {/* 검색어 미입력 시 */}
        {searchWord === "" && <p className="text-gray-600">검색어를 입력해주세요.</p>}

        {/* 검색 결과가 존재하지 않을 시 */}
        {searchWord !== "" && searchResults.length === 0 && (
          <p className="text-gray-600">검색 결과가 존재하지 않습니다.</p>
        )}

        {/* 검색 결과 렌더링 */}
        {searchResults.length > 0 && (
          <ul>
            {searchResults.map((product) => (
              <li
                key={product.id}
                onClick={() => onClickResult(product.id)}
                className="block hover:bg-slate-100 p-2 rounded cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 relative aspect-square">
                    <Image
                      src={product.image}
                      fill
                      alt={`${product.name} 제품 사진`}
                      sizes="10vw"
                      className="object-cover"
                    />
                  </div>
                  <p>{product.name}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
