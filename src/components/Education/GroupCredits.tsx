import { useState } from "react";
import { Panel } from "../UI/Panel";

export interface TeamGroup {
  subteam: string;
  members: string[];
  role: string;
  contribution: string;
}

export const TEAM_GROUPS: TeamGroup[] = [
  {
    subteam: "Project Leadership & Working Model Construction",
    members: ["Justin Joe Mathew (Team Lead)", "Jyothis Liju"],
    role: "Working Model & Circuit Build",
    contribution: "Justin led project organization, built the 3-light breadboard model, and wrote the Arduino C++ code. Jyothis worked directly with Justin to wire LEDs to digital/analog pins and test timing accuracy.",
  },
  {
    subteam: "Hardware Procurement, Testing & Concept Applications",
    members: ["Joseph Alex", "Joseph J"],
    role: "Hardware Sourcing & Application Research",
    contribution: "Joseph Alex bought the Arduino Nano board, LEDs, resistors, and buzzers while testing circuit connections. Joseph J researched real-world uses like city traffic lights and fiber-optic signals.",
  },
  {
    subteam: "Web Design & Frontend Engine Development",
    members: ["Johan Geo", "Johaan Sam"],
    role: "UI Design & Web App Logic",
    contribution: "Johan designed the dark laboratory theme, visual layout, and circular monitors. Johaan wrote the React/TypeScript code for the interactive dials, animation timer, and remainder state solver.",
  },
  {
    subteam: "Presentation Structure & Showcase Lead",
    members: ["Joel Geo Manuel"],
    role: "Presentation & Demo Walkthrough",
    contribution: "Wrote the 2-speaker presentation script between Alex and Sam over team practice sessions, set up the demo slide layout, and coordinated buzzer sound timing during the showcase.",
  },
  {
    subteam: "Mathematics, Proofs & Educational Content",
    members: ["Joel Duke", "Jose Alex", "Jyothika Prakash"],
    role: "Math Equations, Verification & Hint Guides",
    contribution: "Joel Duke worked out the modulo equations and inverse values. Jose double-checked all math steps and solution bounds by hand. Jyothika wrote the 3-step hint system and simple learning guides.",
  },
];

export function GroupCredits() {
  const [open, setOpen] = useState(false);

  return (
    <Panel className="!p-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="focus-ring flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-xs font-bold tracking-[0.18em] text-[#8a6f45] uppercase">
          Project Team & Contribution Breakdown
        </span>
        <span className={`text-[#8a6f45] transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="border-t border-[#e2d2ac] px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {TEAM_GROUPS.map((group) => (
              <div key={group.subteam} className="rounded-lg bg-[#f4e9d4] p-3.5 text-xs leading-relaxed text-[#4a3520]">
                <p className="font-extrabold text-[#3a2510] text-sm">{group.members.join(", ")}</p>
                <p className="font-semibold text-[#8a6f45] mb-1">{group.subteam} — {group.role}</p>
                <p className="text-[#5c462b]">{group.contribution}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
