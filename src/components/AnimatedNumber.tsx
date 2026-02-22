"use client";

export function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  return <span>{value}{suffix}</span>;
}
