import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-gradient-to-b from-[#d9a94f] to-[#b8801f] text-[#3a2510] border-[#8a5f1a] hover:from-[#e2b45c] hover:to-[#c28c28] shadow-[0_3px_0_#7a5215,0_6px_10px_rgba(0,0,0,0.25)] active:shadow-[0_1px_0_#7a5215,0_2px_4px_rgba(0,0,0,0.25)] active:translate-y-[2px]",
  secondary:
    "bg-gradient-to-b from-[#efe0c0] to-[#dcc79a] text-[#4a3520] border-[#a8895c] hover:from-[#f5e9cd] shadow-[0_3px_0_#a8895c,0_6px_10px_rgba(0,0,0,0.15)] active:shadow-[0_1px_0_#a8895c,0_2px_4px_rgba(0,0,0,0.15)] active:translate-y-[2px]",
  ghost:
    "bg-transparent text-[#6b5a42] border-transparent hover:bg-[#00000008] hover:text-[#3a2c1a]",
};

export function Button({ children, variant = "secondary", className = "", disabled, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold tracking-wide uppercase transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:translate-y-0 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
