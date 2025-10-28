import {
  AuthApiErrorMessage,
  DatabaseApiErrorCodes,
  DatabaseApiErrorMessage,
  DatabaseError,
  ErrorReturn,
  StorageApiErrorMessage,
  StorageError,
} from "@/types/error";
import { AuthError } from "@supabase/supabase-js";
import { z, ZodError } from "zod/v4";

function isStorageError(error: unknown): error is StorageError {
  return error instanceof Object && error !== null && "statusCode" in error && "error" in error && "message" in error;
}

function isDatabaseError(error: unknown): error is DatabaseError {
  return (
    error instanceof Object &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "hint" in error &&
    "details" in error
  );
}

export function mapErrors(error: unknown): ErrorReturn {
  console.error(error);

  const DEFAULT_ERROR_MESSAGE = "요청 중 오류가 발생했습니다.";

  if (error instanceof ZodError) {
    return {
      name: "validation",
      code: "validation",
      message: "형식에 맞지 않는 입력값입니다.",
      errors: z.flattenError(error).fieldErrors,
    };
  }

  if (error instanceof AuthError) {
    return mapAuthErrors(error);
  }

  if (isStorageError(error)) {
    const status = Number(error.statusCode);
    if (status < 500) {
      return {
        name: "client",
        code: "client_storage_error",
        message: StorageApiErrorMessage[status as keyof typeof StorageApiErrorMessage] || DEFAULT_ERROR_MESSAGE,
        toast: true,
      };
    }
    if (status >= 500) {
      return {
        name: "server",
        code: "server_storage_error",
        message: StorageApiErrorMessage[status as keyof typeof StorageApiErrorMessage] || DEFAULT_ERROR_MESSAGE,
        toast: true,
      };
    }
  }

  if (isDatabaseError(error)) {
    const clientErrorCode = DatabaseApiErrorCodes.client.find((code) => code === error.code);
    const serverErrorCode = DatabaseApiErrorCodes.server.find((code) => code === error.code);

    if (clientErrorCode) {
      return {
        name: "client",
        code: clientErrorCode,
        message:
          DatabaseApiErrorMessage[clientErrorCode as keyof typeof DatabaseApiErrorMessage] || DEFAULT_ERROR_MESSAGE,
        toast: true,
      };
    }

    if (serverErrorCode) {
      return {
        name: "server",
        code: serverErrorCode,
        message:
          DatabaseApiErrorMessage[serverErrorCode as keyof typeof DatabaseApiErrorMessage] || DEFAULT_ERROR_MESSAGE,
        toast: true,
      };
    }
  }

  return {
    name: "unexpected",
    code: "unexpected_error",
    message: "요청 중 오류가 발생했습니다.",
    toast: true,
  };
}

function mapAuthErrors(error: AuthError): ErrorReturn {
  if (error.code && error.code in AuthApiErrorMessage) {
    return {
      name: "server",
      code: error.code,
      message: AuthApiErrorMessage[error.code as keyof typeof AuthApiErrorMessage],
      toast: true,
    };
  }
  return {
    name: "unexpected",
    code: "unexpected_error",
    message: "알 수 없는 오류가 발생했습니다.",
    toast: true,
  };
}
