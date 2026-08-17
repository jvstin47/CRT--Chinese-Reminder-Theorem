import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useCRTLock } from "./hooks/useCRTLock";
import { useSound } from "./hooks/useSound";
import { defaultPuzzle, puzzles } from "./data/puzzles";
import { LockBox } from "./components/CRTLock/LockBox";
import { MechanismStatus } from "./components/CRTLock/MechanismStatus";
import { HowItWorks } from "./components/Education/HowItWorks";
import { MathExplanation } from "./components/Education/MathExplanation";
import { HintSystem } from "./components/Education/HintSystem";
import { Button } from "./components/UI/Button";
import { Panel } from "./components/UI/Panel";

function App() {
  const lock = useCRTLock(defaultPuzzle);
  const sound = useSound();
  const prevDoorOpen = useRef(lock.doorOpen);
  const prevLatch = useRef(lock.latchReleased);
  const prevRodPhase = useRef(lock.rodPhase);

  useEffect(() => {
    if (lock.rodPhase === "blocked" && prevRodPhase.current !== "blocked") {
      sound.play("blocked");
    }
    if (lock.rodPhase === "sliding" && prevRodPhase.current !== "sliding") {
      sound.play("slide");
    }
    prevRodPhase.current = lock.rodPhase;
  }, [lock.rodPhase, sound]);

  useEffect(() => {
    if (lock.latchReleased && !prevLatch.current) sound.play("latch");
    prevLatch.current = lock.latchReleased;
  }, [lock.latchReleased, sound]);

  useEffect(() => {
    if (lock.doorOpen && !prevDoorOpen.current) {
      sound.play("door");
      const t = window.setTimeout(() => sound.play("success"), 500);
      return () => window.clearTimeout(t);
    }
    prevDoorOpen.current = lock.doorOpen;
  }, [lock.doorOpen, sound]);

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 text-center sm:mb-10">
        <div className="mb-3 flex items-center justify-center gap-2">
          {puzzles.length > 1 && (
            <label className="sr-only" htmlFor="puzzle-select">Choose puzzle</label>
          )}
          <button
            type="button"
            onClick={() => sound.setMuted((m) => !m)}
            aria-pressed={!sound.muted}
            aria-label={sound.muted ? "Unmute sound" : "Mute sound"}
            className="focus-ring rounded-full border border-[#c9ac74] bg-[#fbf4e3] px-3 py-1.5 text-xs text-[#6b5a42] shadow-sm transition hover:bg-[#f5e9cd]"
          >
            {sound.muted ? "🔇 Sound off" : "🔊 Sound on"}
          </button>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#3a2510] sm:text-4xl">CRT LOCK</h1>
        <p className="mt-1 text-sm text-[#6b5a42] sm:text-base">Chinese Remainder Theorem Lock</p>
      </header>

      {puzzles.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {puzzles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => lock.selectPuzzle(p)}
              aria-pressed={lock.puzzle.id === p.id}
              className={`focus-ring rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                lock.puzzle.id === p.id
                  ? "border-[#8a5f1a] bg-[#d9a94f] text-[#3a2510]"
                  : "border-[#c9ac74] bg-[#fbf4e3] text-[#6b5a42] hover:bg-[#f5e9cd]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <LockBox
        lock={lock}
        onTick={() => sound.play("click")}
        onBlocked={() => sound.play("blocked")}
      />

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" onClick={lock.reset}>
          Reset Lock
        </Button>
        <Button
          variant="primary"
          onClick={lock.pullRod}
          disabled={lock.busy || lock.doorOpen || lock.latchReleased}
        >
          Check Lock
        </Button>
        <Button
          variant="primary"
          onClick={lock.openDoor}
          disabled={!lock.latchReleased || lock.doorOpen}
        >
          Open
        </Button>
      </div>

      {lock.doorOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mx-auto mt-6 max-w-md rounded-xl border border-[#c9dfc4] bg-[#eef7ea] p-5 text-center"
        >
          <p className="text-xs font-bold tracking-[0.16em] text-[#3f7a3d] uppercase">Lock Open</p>
          <p className="my-1 text-4xl font-extrabold text-[#2f5c2d]">{lock.puzzle.solution}</p>
          <p className="text-sm text-[#3f7a3d]">All three conditions satisfied.</p>
        </motion.div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-[1.1fr_1fr]">
        <Panel title="Mechanism Status">
          <MechanismStatus
            notchAligned={lock.notchAligned}
            rodPhase={lock.rodPhase}
            latchReleased={lock.latchReleased}
            doorOpen={lock.doorOpen}
          />
        </Panel>
        <HintSystem level={lock.hintLevel} onNextHint={lock.nextHint} />
      </div>

      <div className="mt-6 space-y-4">
        <HowItWorks />
        <MathExplanation puzzle={lock.puzzle} />
      </div>

      <footer className="mt-12 text-center text-xs text-[#8a6f45]/70">
        A cardboard puzzle box, rebuilt in code.
      </footer>
    </div>
  );
}

export default App;
