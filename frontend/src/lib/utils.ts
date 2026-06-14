import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiBaseUrl() {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return 'http://backend:8080';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
}

