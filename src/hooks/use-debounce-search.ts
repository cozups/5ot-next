"use client";

import { getProductByName } from "@/features/product/queries";
import { Products } from "@/types/products";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export function useDebounceSearch(value: string, delay: number = 300) {
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState<string>(value);
  const [searchResults, setSearchResults] = useState<Products[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchKeyword(value);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [delay, value]);

  useEffect(() => {
    async function searchProducts() {
      const supabase = createClient();
      if (debouncedSearchKeyword.trim().length > 0) {
        const searchedProducts = await getProductByName(supabase, debouncedSearchKeyword);
        setSearchResults(searchedProducts.data || []);
      } else {
        setSearchResults([]);
      }
    }

    if (debouncedSearchKeyword !== "") {
      searchProducts();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchKeyword]); // debouncedSearchKeyword가 바뀔 때마다 실행

  return { searchResults, setSearchResults };
}
