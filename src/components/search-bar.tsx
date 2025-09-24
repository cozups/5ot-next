"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import _ from "lodash";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { getProductByName } from "@/actions/products";
import { Products } from "@/types/products";
import { cn } from "@/lib/utils";

export default function SearchBar({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Products[]>([]);

  const debounceSearch = useCallback(
    _.debounce(async (query: string) => {
      if (query.trim().length > 0) {
        const searchedProducts = await getProductByName(query);
        setSearchResults(searchedProducts);
      }
    }, 300),
    []
  );

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.trim().length === 0) {
      setSearchResults([]);
    }

    setSearchWord(value);
    setIsOpen(true);

    debounceSearch(value);
  };
  const onClickInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setIsOpen(true);
  };

  return (
    <div className={cn(className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className={cn("flex items-end gap-1", "md:gap-2")}>
            <Search className={cn("w-3 text-gray-500", "md:w-4")} />
            <input
              type="text"
              className={cn("border-b border-b-gray-400 w-full", "lg:w-36")}
              ref={inputRef}
              onChange={onInputChange}
              onClick={onClickInput}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="max-h-[32rem] overflow-auto"
          align="start"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef?.current?.focus();
          }}
          onPointerDownOutside={(event) => {
            if (event.target !== inputRef.current) {
              setIsOpen(false);
            }
          }}
        >
          {searchWord === "" && <p className="text-sm text-gray-600">검색어를 입력해주세요.</p>}
          {searchWord !== "" && searchResults.length === 0 && (
            <p className="text-sm text-gray-600">검색 결과가 존재하지 않습니다.</p>
          )}
          {searchResults.length > 0 && (
            <ul>
              {searchResults.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/${product.category}/${product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block hover:bg-slate-100 p-2 rounded"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 relative aspect-square object-cover">
                        <Image src={product.image} fill alt={product.name} sizes="10vw" />
                      </div>
                      <p>{product.name}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
