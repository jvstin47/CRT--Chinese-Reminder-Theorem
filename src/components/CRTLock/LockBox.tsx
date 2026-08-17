import { motion } from "framer-motion";
import type { UseCRTLockReturn } from "../../hooks/useCRTLock";
import { DIAL_SPECS } from "../../hooks/useCRTLock";
import { ModularDial } from "./ModularDial";
import { NumberWheel } from "./NumberWheel";
import { SlidingRod } from "./SlidingRod";
import { Latch } from "./Latch";
import { Door } from "./Door";
import { InternalMechanism } from "./InternalMechanism";
import { Button } from "../UI/Button";

const dialColors: Record<string, { color: string; dark: string }> = {
  mod3: { color: "var(--color-dial-mod3)", dark: "var(--color-dial-mod3-dark)" },
  mod5: { color: "var(--color-dial-mod5)", dark: "var(--color-dial-mod5-dark)" },
  mod7: { color: "var(--color-dial-mod7)", dark: "var(--color-dial-mod7-dark)" },
};

interface LockBoxProps {
  lock: UseCRTLockReturn;
  onTick: () => void;
  onBlocked: () => void;
}

export function LockBox({ lock, onTick, onBlocked }: LockBoxProps) {
  const rowDisabled = lock.busy || lock.doorOpen;

  return (
    <div
      className="relative rounded-2xl border-[3px] border-[#8a5f38] p-4 shadow-[0_2px_0_rgba(255,255,255,0.25)_inset,0_20px_45px_-15px_rgba(50,32,10,0.55)] sm:p-6"
      style={{
        background:
          "linear-gradient(155deg, #d1a771 0%, #c99a65 35%, #b88955 70%, #a87543 100%)",
        backgroundImage:
          "linear-gradient(155deg, #d1a771 0%, #c99a65 35%, #b88955 70%, #a87543 100%), repeating-linear-gradient(115deg, rgba(90,60,25,0.05) 0px, rgba(90,60,25,0.05) 2px, transparent 2px, transparent 10px)",
      }}
    >
      <div className="pointer-events-none absolute inset-2 rounded-xl border-2 border-dashed border-[#8a5f38]/40" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-[#4a3010] sm:text-xl">CRT Lock Mechanism</h2>
          <p className="text-xs text-[#5c3f22]/80">Rotate the dials. Turn the wheel. Pull the rod.</p>
        </div>
        <Button variant="ghost" className="!text-[11px] !text-[#5c3f22]" onClick={() => lock.setInternalView(!lock.internalView)}>
          {lock.internalView ? "Hide Inside" : "View Inside"}
        </Button>
      </div>

      {lock.internalView ? (
          <motion.div key="internal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <InternalMechanism
              notchAligned={lock.notchAligned}
              rodPhase={lock.rodPhase}
              latchReleased={lock.latchReleased}
              doorOpen={lock.doorOpen}
            />
          </motion.div>
        ) : (
          <motion.div key="mechanical" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <div className="flex flex-wrap items-start justify-center gap-x-4 gap-y-8 rounded-xl bg-[#00000008] p-3 sm:flex-nowrap sm:justify-between sm:p-5">
              <div className="flex flex-wrap justify-center gap-3 sm:flex-nowrap sm:gap-2">
                {DIAL_SPECS.map((spec, i) => (
                  <ModularDial
                    key={spec.key}
                    label={spec.label}
                    modulus={spec.modulus}
                    value={lock.dials[spec.key]}
                    remainder={lock.puzzle.remainders[i]}
                    aligned={lock.notchAligned[spec.key]}
                    color={dialColors[spec.key].color}
                    colorDark={dialColors[spec.key].dark}
                    disabled={rowDisabled}
                    onChange={(v) => lock.setDial(spec.key, v)}
                    onTick={onTick}
                  />
                ))}
              </div>

              <NumberWheel
                lo={lock.puzzle.wheelRange[0]}
                hi={lock.puzzle.wheelRange[1]}
                value={lock.selectedNumber}
                matchesSolution={lock.wheelAligned}
                disabled={rowDisabled}
                onChange={lock.setSelectedNumber}
                onTick={onTick}
              />

              <div className="flex flex-col items-center gap-3">
                <div className="flex items-end gap-4">
                  <Latch released={lock.latchReleased} />
                  <Door open={lock.doorOpen} latchReleased={lock.latchReleased} secretNumber={lock.puzzle.solution} />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <SlidingRod
                phase={lock.rodPhase}
                disabled={rowDisabled || lock.latchReleased}
                onPull={() => {
                  const willUnlock = lock.canUnlock;
                  lock.pullRod();
                  if (!willUnlock) onBlocked();
                }}
              />
            </div>
          </motion.div>
        )}
    </div>
  );
}
