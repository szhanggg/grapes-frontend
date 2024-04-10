import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colorGrade = (grade: number) => {
  if (grade >= 89.5) {
    return "text-green-500";
  } else if (grade >= 79.5) {
    return "text-blue-500";
  } else if (grade >= 69.5) {
    return "text-yellow-500";
  } else if (grade >= 59.5) {
    return "text-orange-500";
  } else if (grade >= 0) {
    return "text-red-500";
  } else {
    return "text-gray-500";
  }
};

export const letterGrade = (grade: number) => {
  if (grade >= 89.5) {
    return "A";
  } else if (grade >= 79.5) {
    return "B";
  } else if (grade >= 69.5) {
    return "C";
  } else if (grade >= 59.5) {
    return "D";
  } else if (grade >= 0) {
    return "E";
  } else {
    return "N/A";
  }
};
