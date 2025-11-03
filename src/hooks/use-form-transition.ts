import { useErrorStore } from "@/store/error";
import { ApiResponse } from "@/types/response";
import { useTransition } from "react";
import { toast } from "sonner";

interface UseFormTransitionOptions {
  onSuccessText?: string[];
  onSuccess?: () => void;
}

const DEFAULT_SUCCESS_TEXT = ["요청이 완료되었습니다."];

export function useFormTransition<
  T = void,
  U extends ApiResponse<Record<string, string | File | undefined>, null> = ApiResponse<
    Record<string, string | File | undefined>,
    null
  >
>(
  action: T extends void ? () => Promise<U> : (data: T, ...args: any[]) => Promise<U>,
  { onSuccessText, onSuccess }: UseFormTransitionOptions = {}
) {
  const [isPending, startTransition] = useTransition();
  const { addError } = useErrorStore();

  const execute = (data?: T, ...args: any[]) => {
    startTransition(async () => {
      try {
        const result = await action(data as T, ...args);

        const [toastTitle, toastDescription] = onSuccessText || DEFAULT_SUCCESS_TEXT;
        if (result.success) {
          toast.success(toastTitle, {
            description: toastDescription,
          });
          onSuccess?.();
        }

        if (result.errors) {
          addError(result.errors);
        }
      } catch (error) {
        console.error(error);
        toast.error("예상치 못한 오류가 발생했습니다.");
      }
    });
  };

  return { isPending, execute };
}
