import { UserContext } from "@/store/user";
import { useContext } from "react";

export function useUser() {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser를 사용하려면 UserProvider로 감싸야 합니다.");
  }

  return context;
}
