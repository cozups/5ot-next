"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export function useUser() {
  const supabase = createClient();

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return { user, isLoading, refetch };
}
