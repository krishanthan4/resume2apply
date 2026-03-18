import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function stripUrl(url: string | undefined): string {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
