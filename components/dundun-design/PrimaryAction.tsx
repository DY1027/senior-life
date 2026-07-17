import Link from "next/link";
import type { ReactNode } from "react";

type PrimaryActionProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
  ariaLabel?: string;
};

const variants = {
  primary: "dd-action-primary",
  secondary: "dd-action-secondary",
  quiet: "dd-action-quiet",
} as const;

export function PrimaryAction({
  href,
  children,
  variant = "primary",
  className = "",
  ariaLabel,
}: PrimaryActionProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`dd-action ${variants[variant]} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
