"use client";

import { getProductByName } from "@/features/product/queries";
import { Products } from "@/types/products";
import { createClient } from "@/utils/supabase/client";
import _ from "lodash";
import { useCallback, useState } from "react";

export function useDebounceSearch() {
  const [searchResults, setSearchResults] = useState<Products[]>([]);

  const debounceSearch = useCallback(
    _.debounce(async (query: string) => {
      const supabase = createClient();
      if (query.trim().length > 0) {
        const searchedProducts = await getProductByName(supabase, query);
        setSearchResults(searchedProducts.data || []);
      }
    }, 300),
    []
  );

  return { searchResults, setSearchResults, debounceSearch };
}
