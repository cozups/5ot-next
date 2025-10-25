import { Category } from "@/types/category";
import { createClient } from "@/utils/supabase/client";
import { useQueries } from "@tanstack/react-query";

export function useCategory() {
  const fetchCategory = async (sex: "men" | "women") => {
    const supabase = createClient();
    const { data } = await supabase.from("category").select().eq("sex", sex).overrideTypes<Category[]>();
    return data;
  };

  const [menQuery, womenQuery] = useQueries({
    queries: [
      { queryKey: ["category", "men"], queryFn: () => fetchCategory("men"), staleTime: Infinity },
      { queryKey: ["category", "women"], queryFn: () => fetchCategory("women"), staleTime: Infinity },
    ],
  });

  if (menQuery.isError || womenQuery.isError) {
    throw menQuery.error || womenQuery.error;
  }

  return { men: menQuery.data || [], women: womenQuery.data || [] };
}
