import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    async function fetchUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    }
    fetchUser();
  }, []);

  return { user, isLoading };
}
