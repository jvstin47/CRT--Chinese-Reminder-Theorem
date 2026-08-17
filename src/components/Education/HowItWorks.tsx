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
        <span className="text-xs font-bold tracking-[0.18em] text-[#8a6f45] uppercase">How the Lock Works</span>
        <span className={`text-[#8a6f45] transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-[#e2d2ac] px-5 py-4 text-sm leading-relaxed text-[#4a3520]">
          <p>
            Each rotating dial hides a small notch. The three notches act like three separate gates —
            one for the <b>mod 3</b> dial, one for <b>mod 5</b>, and one for <b>mod 7</b>. The horizontal
            rod can only pass through when all three gates line up at once.
          </p>
          <p>
            The number wheel is where you try out a candidate number. When the rod finally slides free,
            it pushes the latch back and the door swings open — revealing the one number that satisfies
            every dial simultaneously.
          </p>
          <div className="rounded-lg bg-[#f4e9d4] p-4 font-mono text-xs leading-relaxed text-[#4a3520]">
            <div>x ≡ 2 (mod 3)</div>
            <div>x ≡ 3 (mod 5)</div>
            <div>x ≡ 2 (mod 7)</div>
            <div className="mt-2 font-bold">Solution: x = 23</div>
          </div>
          <p className="text-xs text-[#8a6f45]">
            This is the Chinese Remainder Theorem: for moduli that share no common factors, there is
            exactly one number (within their product) that satisfies all the conditions at once.
          </p>
        </div>
      )}
    </Panel>
  );
}
