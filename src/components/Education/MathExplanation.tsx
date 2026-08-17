import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "../UI/Panel";
import type { Puzzle } from "../../data/puzzles";
import { getRemainder } from "../../utils/crt";

interface MathExplanationProps {
  puzzle: Puzzle;
}

const lineVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.18, duration: 0.35 } }),
};

export function MathExplanation({ puzzle }: MathExplanationProps) {
  const [open, setOpen] = useState(false);
  const { moduli, remainders, solution } = puzzle;

  const divisionLines = moduli.map((m) => `${solution} ÷ ${m} → remainder ${getRemainder(solution, m)}`);
  const congruenceLines = moduli.map((m, i) => `${solution} ≡ ${remainders[i]} (mod ${m})`);

  return (
    <Panel className="!p-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="focus-ring flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-xs font-bold tracking-[0.18em] text-[#8a6f45] uppercase">Show Mathematics</span>
        <span className={`text-[#8a6f45] transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-[#e2d2ac] px-5 py-4">
              <div className="rounded-lg bg-[#f4e9d4] p-4 font-mono text-xs leading-loose text-[#4a3520]">
                {divisionLines.map((line, i) => (
                  <motion.div key={line} custom={i} initial="hidden" animate="visible" variants={lineVariants}>
                    {line}
                  </motion.div>
                ))}
              </div>

              <div className="rounded-lg bg-[#f4e9d4] p-4 font-mono text-xs leading-loose text-[#4a3520]">
                <motion.div custom={moduli.length} initial="hidden" animate="visible" variants={lineVariants} className="mb-2 font-bold not-italic">
                  Therefore:
                </motion.div>
                {congruenceLines.map((line, i) => (
                  <motion.div key={line} custom={moduli.length + 1 + i} initial="hidden" animate="visible" variants={lineVariants}>
                    {line}
                  </motion.div>
                ))}
              </div>

              <motion.div
                custom={moduli.length * 2 + 2}
                initial="hidden"
                animate="visible"
                variants={lineVariants}
                className="rounded-lg border border-[#c9dfc4] bg-[#eef7ea] p-4 text-sm text-[#2f5c2d]"
              >
                <p>The three conditions agree.</p>
                <p className="mt-1 text-base font-bold">Solution = {solution}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}
