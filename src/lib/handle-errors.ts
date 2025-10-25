import { AuthApiErrorMessage, ErrorReturn } from "@/types/error";
import { AuthError } from "@supabase/supabase-js";
import { z, ZodError } from "zod/v4";

export function mapErrors(error: unknown): ErrorReturn {
  console.error(error);
  if (error instanceof ZodError) {
    return {
      name: "validation",
      message: "형식에 맞지 않는 입력값입니다.",
      errors: z.flattenError(error).fieldErrors,
    };
  }

  if (error instanceof AuthError) {
    return mapAuthErrors(error);
  }

  return {
    name: "server",
    message: "요청 중 오류가 발생했습니다.",
  };
}

function mapAuthErrors(error: AuthError): ErrorReturn {
  if (error.code && error.code in AuthApiErrorMessage) {
    return {
      name: "server",
      code: error.code,
      message: AuthApiErrorMessage[error.code as keyof typeof AuthApiErrorMessage],
    };
  }
  return {
    name: "unexpected",
    message: "알 수 없는 오류가 발생했습니다.",
  };
}
