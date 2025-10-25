import { User } from "@supabase/supabase-js";
import { ErrorReturn } from "./error";

export interface ApiResponse<T, U> {
  success: boolean; // 처리 성공 여부
  errors?: ErrorReturn; // 필드별 오류 메시지 or 응답 오류 메시지
  data?: U; // 실제 응답 데이터
  values?: T; // 폼에 입력된 값
  user?: User; // 인증된 사용자 정보
}

export interface PaginationResponse<T> {
  success: boolean; // 처리 성공 여부
  data?: T | null;
  count: number;
  errors?: ErrorReturn; //  응답 오류 메시지
}
