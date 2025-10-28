"use client";

import { toast } from "sonner";
import { useEffect } from "react";

import { useErrorStore } from "@/store/error";

export default function GlobalErrorToast() {
  const { errors, removeError } = useErrorStore();

  useEffect(() => {
    errors.forEach((error) => {
      if (error.toast) {
        toast.error(error.message);
        removeError(error);
      }
    });
  }, [errors, removeError]);

  return null;
}
