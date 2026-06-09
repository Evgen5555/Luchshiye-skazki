import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed",
  secondary:
    "bg-white text-foreground border border-border hover:bg-[#fff5eb]",
  ghost: "bg-transparent text-muted hover:text-foreground",
};

export function Button({
  variant = "primary",
  fullWidth,
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`rounded-full px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    />
  );
}
