import { ErrorReturn } from "@/types/error";
import { create } from "zustand";

interface ErrorState {
  errors: ErrorReturn[];
  addError: (error: ErrorReturn) => void;
  removeError: (error: ErrorReturn) => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  errors: [],
  addError: (error) => set((state) => ({ errors: [...state.errors, error] })),
  removeError: (error) => set((state) => ({ errors: state.errors.filter((err) => err.code !== error.code) })),
}));
