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
    role: "Working Model & Microcontroller Architecture",
    contribution: "Justin led overall system architecture, breadboard circuit assembly, and C++ firmware development. Jyothis co-developed the physical model, wiring digital/analog pins and conducting timing verification.",
  },
  {
    subteam: "Hardware Procurement, Testing & Concept Applications",
    members: ["Joseph Alex", "Joseph J"],
    role: "Hardware Sourcing, Bench Testing & Use-Case Mapping",
    contribution: "Joseph Alex acquired Arduino Nano boards, LEDs, resistors, and acoustic buzzers while executing bench testing. Joseph J mapped CRT congruences to ITS traffic systems and fiber-optic networking.",
  },
  {
    subteam: "Web Design & Frontend Engine Development",
    members: ["Johan Geo", "Johaan Sam"],
    role: "UI/UX Architecture & React State Engine",
    contribution: "Johan designed the visual layout, dark laboratory aesthetic, and SVG circular monitors. Johaan built the React 19 state engine, 60 FPS animation loops, and dynamic CRT remainder solver.",
  },
  {
    subteam: "Presentation Structure & Showcase Lead",
    members: ["Joel Geo Manuel"],
    role: "Presentation Pacing & Live Demo Walkthrough",
    contribution: "Authored the 2-speaker presentation dialogue script between driver Alex and tech lead Sam, structured demo pacing, and coordinated acoustic chime feedback during live demonstrations.",
  },
  {
    subteam: "Mathematics, Proofs & Pedagogical Design",
    members: ["Joel Duke", "Jose Alex", "Jyothika Prakash"],
    role: "Number Theory, Formal Proofs & Educational Engine",
    contribution: "Joel Duke formulated system congruences and Extended Euclidean inverses. Jose verified solution existence/uniqueness bounds modulo 105. Jyothika designed the 3-tier progressive hint engine.",
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
