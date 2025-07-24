import { z } from 'zod/v4';

export interface ApiResponse<T, U> {
  success: boolean;
  errors?: Record<string, string[]>;
  values?: z.infer<T>;
  data?: U;
}

export interface PaginationResponse<T> {
  data?: T | null;
  count?: number;
}
