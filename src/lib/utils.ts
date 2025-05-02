import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Date Formatting
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}


// Text Formatting
export function toCamelCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}


// Search and Matching
export function uniqueArray<T>(array: T[]): T[] {
  // Create a Set to store the lowercase versions of the elements
  const uniqueSet = new Set<string>();

  // Filter out duplicates by checking if the lowercase version has already been added to the Set
  const uniqueArray = array.filter((item) => {
    const lowercasedItem = item.toLowerCase();
    if (uniqueSet.has(lowercasedItem)) {
      return false; // If the lowercase item is already in the set, skip it
    }
    uniqueSet.add(lowercasedItem); // Add the lowercase item to the set
    return true; // Include the original item
  });

  return uniqueArray;
}

// Sorting

export function sortByValue(array: string[]): string[] {
  // sort by alphabetical order
  return array.sort((a, b) => a.localeCompare(b));
}