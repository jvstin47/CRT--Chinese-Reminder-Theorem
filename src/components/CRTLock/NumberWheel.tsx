import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";

interface NumberWheelProps {
  lo: number;
  hi: number;
  value: number;
  matchesSolution: boolean;
  disabled?: boolean;
  onChange: (value: number) => void;
  onTick?: () => void;
}

const SIZE = 200;
const C = SIZE / 2;
const RIM = 86;
const LABEL_R = 70;

function toXY(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(rad), y: C - r * Math.cos(rad) };
}

function angleFromCenter(px: number, py: number) {
  const dx = px - C;
  const dy = py - C;
  let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

function norm(deg: number) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

export function NumberWheel({ lo, hi, value, matchesSolution, disabled, onChange, onTick }: NumberWheelProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const count = hi - lo + 1;
  const step = 360 / count;
  const selectedIndex = value - lo;

  const dragRef = useRef<{ startMouseAngle: number; startTheta: number; lastIndex: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const wheelAccum = useRef(0);

  const clientToLocalAngle = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const scale = SIZE / rect.width;
    const localX = (clientX - rect.left) * scale;
    const localY = (clientY - rect.top) * scale;
    return angleFromCenter(localX, localY);
  }, []);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (disabled) return;
      (e.target as Element).setPointerCapture(e.pointerId);
      setDragging(true);
      const startMouseAngle = clientToLocalAngle(e.clientX, e.clientY);
      dragRef.current = { startMouseAngle, startTheta: -selectedIndex * step, lastIndex: selectedIndex };
    },
    [disabled, clientToLocalAngle, selectedIndex, step]
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (!dragging || disabled || !dragRef.current) return;
      const mouseAngle = clientToLocalAngle(e.clientX, e.clientY);
      let delta = mouseAngle - dragRef.current.startMouseAngle;
      delta = ((delta + 180) % 360 + 360) % 360 - 180;
      const newTheta = dragRef.current.startTheta + delta;
      let newIndex = Math.round(-newTheta / step) % count;
      newIndex = ((newIndex % count) + count) % count;
      if (newIndex !== dragRef.current.lastIndex) {
        dragRef.current.lastIndex = newIndex;
        onChange(lo + newIndex);
        onTick?.();
      }
    },
    [dragging, disabled, clientToLocalAngle, step, count, lo, onChange, onTick]
  );

  const handlePointerUp = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    setDragging(false);
    dragRef.current = null;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }, []);

  const handleWheelEvent = useCallback(
    (e: ReactWheelEvent<SVGSVGElement>) => {
      if (disabled) return;
      e.preventDefault();
      wheelAccum.current += e.deltaY;
      const threshold = 40;
      while (Math.abs(wheelAccum.current) >= threshold) {
        if (wheelAccum.current > 0) {
          onChange(lo + ((selectedIndex + 1) % count));
          wheelAccum.current -= threshold;
        } else {
          onChange(lo + ((selectedIndex - 1 + count) % count));
          wheelAccum.current += threshold;
        }
        onTick?.();
      }
    },
    [disabled, lo, count, selectedIndex, onChange, onTick]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        e.preventDefault();
        onChange(lo + ((selectedIndex + 1) % count));
        onTick?.();
      } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        e.preventDefault();
        onChange(lo + ((selectedIndex - 1 + count) % count));
        onTick?.();
      }
    },
    [disabled, selectedIndex, count, lo, onChange, onTick]
  );

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="rounded-full bg-[#5f5f58] px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-white shadow-sm">
        NUMBER WHEEL
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label="Number wheel"
        aria-valuemin={lo}
        aria-valuemax={hi}
        aria-valuenow={value}
        aria-disabled={disabled}
        className={`focus-ring overflow-visible outline-none ${disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheelEvent}
        onKeyDown={handleKeyDown}
      >
        <circle cx={C} cy={C} r={RIM + 14} fill="var(--color-metal)" opacity={0.25} />
        <circle cx={C} cy={C} r={RIM + 8} fill="var(--color-wood)" stroke="var(--color-cardboard-edge)" strokeWidth={3} />
        <circle cx={C} cy={C} r={RIM - 6} fill="var(--color-paper)" stroke="var(--color-cardboard-dark)" strokeWidth={2} />

        {Array.from({ length: count }).map((_, k) => {
          const screenAngle = norm((k - selectedIndex) * step);
          const isTop = k === selectedIndex;
          const p = toXY(screenAngle, LABEL_R);
          const opacity = 0.35 + 0.65 * Math.max(0, Math.cos((screenAngle * Math.PI) / 180));
          return (
            <g key={lo + k} style={{ transition: dragging ? "none" : "all 0.35s cubic-bezier(0.34,1.2,0.4,1)" }} opacity={opacity}>
              <circle cx={p.x} cy={p.y} r={isTop ? 17 : 13} fill={isTop ? "var(--color-wood)" : "var(--color-paper-dark)"} stroke="var(--color-cardboard-edge)" strokeWidth={1.5} />
              <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize={isTop ? 14 : 11} fontWeight={isTop ? 800 : 600} fill={isTop ? "#fff" : "var(--color-ink-soft)"} style={{ pointerEvents: "none" }}>
                {lo + k}
              </text>
            </g>
          );
        })}

        <path d={`M ${C - 8} ${C - RIM - 2} L ${C + 8} ${C - RIM - 2} L ${C} ${C - RIM + 12} Z`} fill={matchesSolution ? "#3f9a52" : "var(--color-metal-dark)"} style={{ filter: matchesSolution ? "drop-shadow(0 0 4px rgba(63,154,82,0.8))" : "none", transition: "all 0.25s ease" }} />

        <circle cx={C} cy={C} r={40} fill="var(--color-cardboard-darker)" stroke="var(--color-cardboard-edge)" strokeWidth={2} />
        <text x={C} y={C} textAnchor="middle" dominantBaseline="central" fontSize={30} fontWeight={800} fill="#f4e9d4">
          {value}
        </text>
      </svg>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={disabled}
          aria-label="Decrease number wheel"
          onClick={() => {
            onChange(lo + ((selectedIndex - 1 + count) % count));
            onTick?.();
          }}
          className="focus-ring flex h-7 w-7 items-center justify-center rounded-full border border-[#a8895c] bg-[#efe0c0] text-sm font-bold text-[#4a3520] shadow-sm transition hover:bg-[#f5e9cd] active:translate-y-px disabled:opacity-30"
        >
          −
        </button>
        <span className="w-24 text-center text-[11px] font-medium text-[#8a6f45]">
          candidate x
        </span>
        <button
          type="button"
          disabled={disabled}
          aria-label="Increase number wheel"
          onClick={() => {
            onChange(lo + ((selectedIndex + 1) % count));
            onTick?.();
          }}
          className="focus-ring flex h-7 w-7 items-center justify-center rounded-full border border-[#a8895c] bg-[#efe0c0] text-sm font-bold text-[#4a3520] shadow-sm transition hover:bg-[#f5e9cd] active:translate-y-px disabled:opacity-30"
        >
          +
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        Number wheel, current value {value}.
      </p>
    </div>
  );
}
