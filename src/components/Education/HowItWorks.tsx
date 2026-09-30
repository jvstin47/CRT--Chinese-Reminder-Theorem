import { useState } from "react";
import { Panel } from "../UI/Panel";

export function HowItWorks() {
  const [open, setOpen] = useState(false);

  return (
    <Panel className="!p-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="focus-ring flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-xs font-bold tracking-[0.18em] text-[#8a6f45] uppercase">How Signal Synchronization Works</span>
        <span className={`text-[#8a6f45] transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-[#e2d2ac] px-5 py-4 text-sm leading-relaxed text-[#4a3520]">
          <p>
            Each traffic signal operates on its own cycle length — <b>3 minutes</b> at Intersection 1, <b>5 minutes</b> at Intersection 2, and <b>7 minutes</b> at Intersection 3. The monitors display the remainder state for candidate minute <i>x</i>.
          </p>
          <p>
            The digital timer wheel allows you to select a candidate minute. When all three signal lights simultaneously show green, a continuous 'Green Wave' is established across the entire avenue.
          </p>
          <div className="rounded-lg bg-[#f4e9d4] p-4 font-mono text-xs leading-relaxed text-[#4a3520]">
            <div>Signal 1: x ≡ 2 (mod 3) &nbsp; [Green 2 min ago]</div>
            <div>Signal 2: x ≡ 3 (mod 5) &nbsp; [Green 3 min ago]</div>
            <div>Signal 3: x ≡ 2 (mod 7) &nbsp; [Green 2 min ago]</div>
            <div className="mt-2 font-bold text-[#2f5c2d]">Synchronized Green Wave: Minute x = 23</div>
          </div>
          <p className="text-xs text-[#8a6f45]">
            This demonstrates the Chinese Remainder Theorem: for pairwise coprime cycle lengths (3, 5, 7), there is exactly one unique minute within 105 minutes (Minute 23) where all traffic signals align simultaneously.
          </p>
        </div>
      )}
    </Panel>
  );
}
