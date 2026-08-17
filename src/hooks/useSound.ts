import { useCallback, useRef, useState } from "react";

type SoundName = "click" | "blocked" | "slide" | "latch" | "door" | "success";

export function useSound() {
  const [muted, setMuted] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (muted) return;
      try {
        const ctx = getCtx();
        if (ctx.state === "suspended") void ctx.resume();
        const now = ctx.currentTime;

        const tone = (freq: number, start: number, dur: number, type: OscillatorType, gain: number) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, now + start);
          g.gain.setValueAtTime(0, now + start);
          g.gain.linearRampToValueAtTime(gain, now + start + 0.005);
          g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + start);
          osc.stop(now + start + dur + 0.02);
        };

        switch (name) {
          case "click":
            tone(1400, 0, 0.04, "square", 0.05);
            break;
          case "blocked":
            tone(140, 0, 0.12, "sawtooth", 0.09);
            tone(110, 0.08, 0.14, "sawtooth", 0.07);
            break;
          case "slide":
            tone(300, 0, 0.35, "sawtooth", 0.03);
            break;
          case "latch":
            tone(900, 0, 0.06, "square", 0.08);
            tone(500, 0.05, 0.08, "square", 0.06);
            break;
          case "door":
            tone(200, 0, 0.4, "sawtooth", 0.03);
            break;
          case "success":
            tone(523, 0, 0.15, "triangle", 0.07);
            tone(659, 0.12, 0.15, "triangle", 0.07);
            tone(784, 0.24, 0.3, "triangle", 0.08);
            break;
        }
      } catch {
        /* audio unsupported or blocked, fail silently */
      }
    },
    [muted, getCtx]
  );

  return { muted, setMuted, play };
}
