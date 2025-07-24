import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatInTimeZone } from 'date-fns-tz';
import { customAlphabet } from 'nanoid';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseToKorTime(timestamp: string) {
  const time = new Date(timestamp);

  return formatInTimeZone(time, 'Asia/Seoul', 'yyyy년 MM월 dd일');
}

export function generateRandomId() {
  const nanoid = customAlphabet('1234567890abcdef', 10);
  return nanoid();
}

export function toastError(
  errorTitle: string,
  errors: Record<string, string[]>
) {
  Object.values(errors)
    .flat()
    .forEach((error) => toast.error(errorTitle, { description: error }));
}

export function getTotalPage(
  totalCount: number | undefined,
  itemsPerPage: number
) {
  return totalCount ? Math.ceil(totalCount / itemsPerPage) : 1;
}
