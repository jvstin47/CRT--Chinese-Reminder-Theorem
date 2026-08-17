import { motion } from "framer-motion";
import type { RodPhase } from "../../hooks/useCRTLock";

interface SlidingRodProps {
  phase: RodPhase;
  disabled?: boolean;
  onPull: () => void;
}

const variants = {
  idle: { x: 0, transition: { duration: 0.3 } },
  blocked: {
    x: [0, 16, -7, 11, -4, 0],
    transition: { duration: 0.55, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" as const },
  },
  sliding: { x: 54, transition: { duration: 0.5, ease: "easeInOut" as const } },
  extended: { x: 54, transition: { duration: 0.3 } },
  retracting: { x: 0, transition: { duration: 0.3 } },
};

export function SlidingRod({ phase, disabled, onPull }: SlidingRodProps) {
  const clickable = !disabled && (phase === "idle" || phase === "blocked");

  return (
    <div className="relative flex w-full items-center gap-3 px-2">
      <span className="w-20 shrink-0 text-[10px] font-bold tracking-[0.14em] text-[#8a6f45] uppercase sm:w-24">
        Sliding Rod
      </span>
      <div className="relative h-9 flex-1 overflow-hidden rounded-full border-2 border-[#5f5f58] bg-[#3d3d38] shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-y-0 left-0 right-6 flex items-center">
          <div className="mx-2 h-[3px] w-full rounded-full bg-[#6b6b60] opacity-60" />
        </div>
        <motion.button
          type="button"
          onClick={clickable ? onPull : undefined}
          disabled={!clickable}
          aria-label={phase === "extended" ? "Rod extended, latch released" : "Pull the sliding rod"}
          animate={phase}
          variants={variants}
          initial="idle"
          className="focus-ring absolute top-1/2 left-0 flex h-7 w-14 -translate-y-1/2 items-center justify-center rounded-full border-2 disabled:cursor-default"
          style={{
            background: "linear-gradient(180deg, #d9c08a, #c38a4a 60%, #a5652b)",
            borderColor: "#7a4f22",
            cursor: clickable ? "pointer" : "default",
          }}
        >
          <span className="text-[10px] font-extrabold tracking-wide text-[#3a2510]">
            {phase === "extended" ? "✓" : "→"}
          </span>
        </motion.button>
      </div>
      <span aria-hidden className="hidden shrink-0 text-lg text-[#8a6f45] sm:block">
        {"→"}
      </span>
    </div>
  );
}
