import { Panel } from "../UI/Panel";
import { Button } from "../UI/Button";

interface HintSystemProps {
  level: number;
  onNextHint: () => void;
}

const HINTS = [
  "Look at what each dial controls. Every dial is one condition your final number must satisfy.",
  "Each of the three dials has a specific opening that must line up with the sliding rod before it can move at all.",
  "The number wheel can help you find the number whose remainders satisfy all three conditions — try dividing candidates by 3, 5, and 7.",
];

export function HintSystem({ level, onNextHint }: HintSystemProps) {
  return (
    <Panel title="Need a Hint?">
      <div className="space-y-3">
        {HINTS.slice(0, level).map((hint, i) => (
          <div key={i} className="rounded-lg bg-[#f4e9d4] p-3 text-sm text-[#4a3520]">
            <span className="mr-1.5 font-bold text-[#8a6f45]">Hint {i + 1}:</span>
            {hint}
          </div>
        ))}
        {level < HINTS.length ? (
          <Button variant="ghost" onClick={onNextHint} className="w-full !justify-center">
            {level === 0 ? "Show a hint" : "Show another hint"}
          </Button>
        ) : (
          <p className="text-center text-xs text-[#8a6f45]">That's all the hints — the rest is up to the mechanism.</p>
        )}
      </div>
    </Panel>
  );
}
