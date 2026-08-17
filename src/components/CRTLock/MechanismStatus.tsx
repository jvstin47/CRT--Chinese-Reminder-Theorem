import type { DialKey, RodPhase } from "../../hooks/useCRTLock";
import { DIAL_SPECS } from "../../hooks/useCRTLock";

interface MechanismStatusProps {
  notchAligned: Record<DialKey, boolean>;
  rodPhase: RodPhase;
  latchReleased: boolean;
  doorOpen: boolean;
}

function Row({ label, ok, okText, badText }: { label: string; ok: boolean; okText: string; badText: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#e2d2ac] py-2 last:border-b-0">
      <span className="text-xs font-bold tracking-[0.12em] text-[#6b5a42] uppercase">{label}</span>
      <span
        className={`flex items-center gap-1.5 text-xs font-bold uppercase ${ok ? "text-[#4d7c4a]" : "text-[#a8432f]"}`}
      >
        <span aria-hidden>{ok ? "✓" : "●"}</span>
        {ok ? okText : badText}
      </span>
    </div>
  );
}

export function MechanismStatus({ notchAligned, rodPhase, latchReleased, doorOpen }: MechanismStatusProps) {
  const rodFree = rodPhase === "sliding" || rodPhase === "extended";
  return (
    <div role="status" aria-live="polite">
      {DIAL_SPECS.map((s) => (
        <Row key={s.key} label={s.label} ok={notchAligned[s.key]} okText="Aligned" badText="Blocked" />
      ))}
      <Row label="Rod" ok={rodFree} okText="Free" badText="Blocked" />
      <Row label="Latch" ok={latchReleased} okText="Released" badText="Engaged" />
      <Row label="Door" ok={doorOpen} okText="Unlocked" badText="Locked" />
    </div>
  );
}
