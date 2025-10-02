import { UserContext } from "@/store/user";
import { useContext } from "react";

export function useUser() {
  const context = useContext(UserContext);
  // Note: context can be null if a component is not wrapped in UserProvider.
  // You might want to add an error check here in a real application.
  return context;
}
