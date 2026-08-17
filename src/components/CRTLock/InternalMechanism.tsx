import type { DialKey, RodPhase } from "../../hooks/useCRTLock";
import { DIAL_SPECS } from "../../hooks/useCRTLock";

interface InternalMechanismProps {
  notchAligned: Record<DialKey, boolean>;
  rodPhase: RodPhase;
  latchReleased: boolean;
  doorOpen: boolean;
}

const colors: Record<DialKey, string> = {
  mod3: "var(--color-dial-mod3-dark)",
  mod5: "var(--color-dial-mod5-dark)",
  mod7: "var(--color-dial-mod7-dark)",
};

export function InternalMechanism({ notchAligned, rodPhase, latchReleased, doorOpen }: InternalMechanismProps) {
  const rodFree = rodPhase === "sliding" || rodPhase === "extended";
  const W = 640;
  const H = 190;
  const dialXs = [90, 250, 410];
  const rodY = 110;

  return (
    <div className="overflow-x-auto rounded-lg border border-[#3a3a34] bg-[#22221f] p-4">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="min-w-[560px]" role="img" aria-label="Schematic of the internal locking mechanism">
        <line x1={40} y1={rodY} x2={520} y2={rodY} stroke={rodFree ? "#6fc47a" : "#8b8b83"} strokeWidth={6} strokeLinecap="round" style={{ transition: "stroke 0.3s ease" }} />
        <text x={40} y={rodY - 16} fontSize={11} fill="#c99a65" fontWeight={700}>SLIDING ROD</text>

        {DIAL_SPECS.map((s, i) => {
          const x = dialXs[i];
          const ok = notchAligned[s.key];
          return (
            <g key={s.key}>
              <line x1={x} y1={30} x2={x} y2={H - 20} stroke="#4a4a44" strokeWidth={2} strokeDasharray="4 3" />
              <circle cx={x} cy={rodY} r={26} fill={colors[s.key]} stroke={ok ? "#6fc47a" : "#c9622f"} strokeWidth={4} style={{ transition: "stroke 0.3s ease" }} />
              <text x={x} y={rodY + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">{s.label}</text>
              <text x={x} y={22} textAnchor="middle" fontSize={10} fill={ok ? "#6fc47a" : "#c9622f"} fontWeight={700}>
                {ok ? "OPEN" : "BLOCKED"}
              </text>
            </g>
          );
        })}

        <g>
          <rect x={505} y={rodY - 22} width={20} height={44} rx={2} fill={latchReleased ? "#6fc47a" : "#8b8b83"} style={{ transition: "fill 0.3s ease" }} />
          <text x={515} y={rodY + 42} textAnchor="middle" fontSize={10} fontWeight={700} fill="#c99a65">LATCH</text>
        </g>

        <g>
          <rect x={555} y={40} width={60} height={120} rx={3} fill={doorOpen ? "#355c34" : "#76502f"} stroke="#c99a65" strokeWidth={2} style={{ transition: "fill 0.3s ease" }} />
          <text x={585} y={105} textAnchor="middle" fontSize={11} fontWeight={800} fill="#f4e9d4">DOOR</text>
          <text x={585} y={175} textAnchor="middle" fontSize={10} fontWeight={700} fill={doorOpen ? "#6fc47a" : "#c9622f"}>
            {doorOpen ? "OPEN" : "SHUT"}
          </text>
        </g>
      </svg>
    </div>
  );
}
