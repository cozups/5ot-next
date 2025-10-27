"use client";

import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

import { getUser } from "@/features/auth/queries";

export function useUser() {
  const supabase = createClient();

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getUser(supabase);

      if (response.errors) {
        throw new Error(response.errors.message);
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return { user, isLoading, refetch };
}
