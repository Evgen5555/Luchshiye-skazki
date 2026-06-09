import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition focus:border-accent ${className}`}
      {...props}
    />
  );
}
