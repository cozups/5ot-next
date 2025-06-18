import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatInTimeZone } from 'date-fns-tz';
import { customAlphabet } from 'nanoid';

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
