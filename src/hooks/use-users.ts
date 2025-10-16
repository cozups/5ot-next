import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  return user;
}
