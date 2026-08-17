import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

interface ModularDialProps {
  label: string;
  modulus: number;
  value: number;
  remainder: number;
  aligned: boolean;
  color: string;
  colorDark: string;
  disabled?: boolean;
  onChange: (value: number) => void;
  onTick?: () => void;
}

const SIZE = 140;
const C = SIZE / 2;
const RIM = 62;
const LABEL_R = 46;
const NOTCH_R = 62;
const PIVOT_R = 30;

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

export function ModularDial({
  label,
  modulus,
  value,
  remainder,
  aligned,
  color,
  colorDark,
  disabled,
  onChange,
  onTick,
}: ModularDialProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragState = useRef<{ lastValue: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const step = 360 / modulus;

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
      dragState.current = { lastValue: value };
    },
    [disabled, value]
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (!dragging || disabled) return;
      const angle = clientToLocalAngle(e.clientX, e.clientY);
      const nearest = Math.round(angle / step) % modulus;
      if (dragState.current && nearest !== dragState.current.lastValue) {
        dragState.current.lastValue = nearest;
        onChange(nearest);
        onTick?.();
      }
    },
    [dragging, disabled, clientToLocalAngle, step, modulus, onChange, onTick]
  );

  const handlePointerUp = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    setDragging(false);
    dragState.current = null;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        e.preventDefault();
        onChange((value + 1) % modulus);
        onTick?.();
      } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        e.preventDefault();
        onChange((value - 1 + modulus) % modulus);
        onTick?.();
      } else if (e.key === "Home") {
        e.preventDefault();
        onChange(0);
        onTick?.();
      }
    },
    [disabled, value, modulus, onChange, onTick]
  );

  const rotateDeg = value * step;
  const notchLocalOffset = -remainder * step;
  const gate = toXY(0, NOTCH_R + 9);

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        className="rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-white shadow-sm"
        style={{ backgroundColor: colorDark }}
      >
        {label}
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={`${label} dial`}
          aria-valuemin={0}
          aria-valuemax={modulus - 1}
          aria-valuenow={value}
          aria-valuetext={`position ${value} of ${modulus}`}
          aria-disabled={disabled}
          className={`focus-ring overflow-visible outline-none ${disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          <circle cx={C} cy={C} r={RIM + 12} fill="var(--color-cardboard-dark)" opacity={0.35} />
          <circle
            cx={C}
            cy={C}
            r={RIM + 7}
            fill="none"
            stroke="var(--color-cardboard-edge)"
            strokeWidth={3}
          />
          <circle
            cx={C}
            cy={C}
            r={RIM}
            fill="none"
            stroke="var(--color-cardboard-edge)"
            strokeWidth={1}
            strokeDasharray="1.5 4"
            opacity={0.5}
          />

          {Array.from({ length: modulus }).map((_, k) => {
            const p = toXY(k * step, LABEL_R);
            const isCurrent = k === value;
            return (
              <g key={k}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isCurrent ? 13 : 10}
                  fill={isCurrent ? color : "var(--color-paper)"}
                  stroke={isCurrent ? colorDark : "var(--color-cardboard-edge)"}
                  strokeWidth={isCurrent ? 2 : 1}
                  style={{ transition: dragging ? "none" : "all 0.3s ease" }}
                />
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={isCurrent ? 800 : 600}
                  fill={isCurrent ? "#fff" : "var(--color-ink-soft)"}
                  style={{ pointerEvents: "none", transition: dragging ? "none" : "all 0.3s ease" }}
                >
                  {k}
                </text>
              </g>
            );
          })}

          <g
            style={{
              transformOrigin: `${C}px ${C}px`,
              transform: `rotate(${rotateDeg}deg)`,
              transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.34,1.3,0.4,1)",
            }}
          >
            {(() => {
              const n = toXY(notchLocalOffset, NOTCH_R);
              return (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={aligned ? 6 : 5}
                  fill={aligned ? "#eafff0" : "var(--color-cardboard-edge)"}
                  stroke={aligned ? "#3f9a52" : "var(--color-cardboard-darker)"}
                  strokeWidth={aligned ? 2 : 1.5}
                  style={{
                    filter: aligned ? "drop-shadow(0 0 5px rgba(63,154,82,0.9))" : "none",
                    transition: "all 0.25s ease",
                  }}
                />
              );
            })()}
          </g>

          <circle cx={C} cy={C} r={PIVOT_R} fill={color} stroke={colorDark} strokeWidth={2.5} />
          <text
            x={C}
            y={C}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={22}
            fontWeight={800}
            fill="#fff"
            style={{ pointerEvents: "none" }}
          >
            {value}
          </text>

          <rect
            x={gate.x - 6}
            y={gate.y - 5}
            width={12}
            height={11}
            rx={2.5}
            fill={aligned ? "#3f9a52" : "var(--color-metal-dark)"}
            stroke={aligned ? "#2f7a3d" : "var(--color-cardboard-darker)"}
            strokeWidth={1}
            style={{ filter: aligned ? "drop-shadow(0 0 4px rgba(63,154,82,0.8))" : "none", transition: "all 0.25s ease" }}
          />
        </svg>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={disabled}
          aria-label={`Decrease ${label} dial`}
          onClick={() => {
            onChange((value - 1 + modulus) % modulus);
            onTick?.();
          }}
          className="focus-ring flex h-7 w-7 items-center justify-center rounded-full border border-[#a8895c] bg-[#efe0c0] text-sm font-bold text-[#4a3520] shadow-sm transition hover:bg-[#f5e9cd] active:translate-y-px disabled:opacity-30"
        >
          −
        </button>
        <span className="w-20 text-center text-[11px] font-medium text-[#8a6f45]">
          mod {modulus}
        </span>
        <button
          type="button"
          disabled={disabled}
          aria-label={`Increase ${label} dial`}
          onClick={() => {
            onChange((value + 1) % modulus);
            onTick?.();
          }}
          className="focus-ring flex h-7 w-7 items-center justify-center rounded-full border border-[#a8895c] bg-[#efe0c0] text-sm font-bold text-[#4a3520] shadow-sm transition hover:bg-[#f5e9cd] active:translate-y-px disabled:opacity-30"
        >
          +
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {label} dial, current position {value} of {modulus}. {aligned ? "Notch aligned." : ""}
      </p>
    </div>
  );
}
