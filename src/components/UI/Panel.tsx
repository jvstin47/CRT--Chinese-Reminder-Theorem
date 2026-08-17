import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
}

export function Panel({ children, className = "", title }: PanelProps) {
  return (
    <div
      className={`rounded-xl border border-[#d3bd8f] bg-[#fbf4e3] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_10px_25px_-8px_rgba(60,40,10,0.35)] ${className}`}
    >
      {title && (
        <div className="border-b border-[#e2d2ac] px-5 py-3">
          <h3 className="text-xs font-bold tracking-[0.18em] text-[#8a6f45] uppercase">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
