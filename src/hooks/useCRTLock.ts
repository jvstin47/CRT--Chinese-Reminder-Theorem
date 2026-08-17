import { useCallback, useMemo, useRef, useState } from "react";
import { getRemainder } from "../utils/crt";
import { defaultPuzzle, type Puzzle } from "../data/puzzles";

export type DialKey = "mod3" | "mod5" | "mod7";

export type RodPhase = "idle" | "blocked" | "sliding" | "extended" | "retracting";

interface DialSpec {
  key: DialKey;
  modulus: number;
  label: string;
  colorVar: string;
}

export const DIAL_SPECS: DialSpec[] = [
  { key: "mod3", modulus: 3, label: "MOD 3", colorVar: "mod3" },
  { key: "mod5", modulus: 5, label: "MOD 5", colorVar: "mod5" },
  { key: "mod7", modulus: 7, label: "MOD 7", colorVar: "mod7" },
];

function randomStartDials(puzzle: Puzzle): Record<DialKey, number> {
  const out = {} as Record<DialKey, number>;
  DIAL_SPECS.forEach((spec, i) => {
    const correct = puzzle.remainders[i];
    let value = Math.floor(Math.random() * spec.modulus);
    if (value === correct) value = (value + 1) % spec.modulus;
    out[spec.key] = value;
  });
  return out;
}

export function useCRTLock(initialPuzzle: Puzzle = defaultPuzzle) {
  const [puzzle, setPuzzle] = useState<Puzzle>(initialPuzzle);
  const [dials, setDials] = useState<Record<DialKey, number>>(() => randomStartDials(initialPuzzle));
  const [selectedNumber, setSelectedNumberRaw] = useState<number>(initialPuzzle.wheelRange[0]);
  const [rodPhase, setRodPhase] = useState<RodPhase>("idle");
  const [latchReleased, setLatchReleased] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [blockedPulse, setBlockedPulse] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [internalView, setInternalView] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const after = (ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  const notchAligned = useMemo(() => {
    const out = {} as Record<DialKey, boolean>;
    DIAL_SPECS.forEach((spec, i) => {
      out[spec.key] = dials[spec.key] === puzzle.remainders[i];
    });
    return out;
  }, [dials, puzzle]);

  const allNotchesAligned = DIAL_SPECS.every((s) => notchAligned[s.key]);
  const wheelAligned = selectedNumber === puzzle.solution;
  const canUnlock = allNotchesAligned && wheelAligned;

  const busy = rodPhase === "sliding" || rodPhase === "extended" || rodPhase === "retracting";

  const setDial = useCallback((key: DialKey, value: number) => {
    if (busy || doorOpen) return;
    setDials((prev) => {
      const spec = DIAL_SPECS.find((s) => s.key === key)!;
      return { ...prev, [key]: getRemainder(value, spec.modulus) };
    });
  }, [busy, doorOpen]);

  const rotateDialBy = useCallback((key: DialKey, delta: number) => {
    setDial(key, (dials[key] ?? 0) + delta);
  }, [dials, setDial]);

  const setSelectedNumber = useCallback((n: number) => {
    if (busy || doorOpen) return;
    const [lo, hi] = puzzle.wheelRange;
    const span = hi - lo + 1;
    const wrapped = lo + ((((n - lo) % span) + span) % span);
    setSelectedNumberRaw(wrapped);
  }, [busy, doorOpen, puzzle.wheelRange]);

  const pullRod = useCallback(() => {
    if (busy || doorOpen || latchReleased) return;
    setAttempts((a) => a + 1);

    if (!canUnlock) {
      setRodPhase("blocked");
      setBlockedPulse((p) => p + 1);
      after(650, () => setRodPhase("idle"));
      return;
    }

    setRodPhase("sliding");
    after(500, () => {
      setRodPhase("extended");
      setLatchReleased(true);
    });
  }, [busy, doorOpen, latchReleased, canUnlock]);

  const openDoor = useCallback(() => {
    if (!latchReleased || doorOpen) return;
    setDoorOpen(true);
  }, [latchReleased, doorOpen]);

  const reset = useCallback(() => {
    clearTimers();
    setDoorOpen(false);
    after(doorOpen ? 500 : 0, () => {
      setLatchReleased(false);
      setRodPhase("idle");
      setDials(randomStartDials(puzzle));
      setSelectedNumberRaw(puzzle.wheelRange[0]);
      setHintLevel(0);
      setAttempts(0);
    });
  }, [puzzle, doorOpen]);

  const selectPuzzle = useCallback((p: Puzzle) => {
    clearTimers();
    setPuzzle(p);
    setDoorOpen(false);
    setLatchReleased(false);
    setRodPhase("idle");
    setDials(randomStartDials(p));
    setSelectedNumberRaw(p.wheelRange[0]);
    setHintLevel(0);
    setAttempts(0);
  }, []);

  const nextHint = useCallback(() => {
    setHintLevel((h) => Math.min(h + 1, 3));
  }, []);

  return {
    puzzle,
    dials,
    selectedNumber,
    rodPhase,
    latchReleased,
    doorOpen,
    blockedPulse,
    hintLevel,
    attempts,
    internalView,
    notchAligned,
    allNotchesAligned,
    wheelAligned,
    canUnlock,
    busy,
    setDial,
    rotateDialBy,
    setSelectedNumber,
    pullRod,
    openDoor,
    reset,
    selectPuzzle,
    nextHint,
    setInternalView,
  };
}

export type UseCRTLockReturn = ReturnType<typeof useCRTLock>;
