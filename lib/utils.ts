import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export from canonical source (lib/utils/vat.ts) for backward compatibility
export { formatPriceDe, formatPriceDe as formatPrice } from "@/lib/utils/vat"

export function formatDate(date: string, locale = 'de-DE'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}
