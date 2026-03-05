import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isExternalImage(src: string | null | undefined): boolean {
  return !!(src && (src.startsWith("http://") || src.startsWith("https://")));
}
