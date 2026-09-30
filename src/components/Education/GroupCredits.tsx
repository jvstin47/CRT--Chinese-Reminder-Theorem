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
    contribution: "Justin led overall system architecture over four weeks, constructing the 3-intersection breadboard prototype and writing C++ firmware. Jyothis collaborated over two weeks on pin mapping, wiring digital/analog outputs, and conducting signal timing tests.",
  },
  {
    subteam: "Hardware Procurement, Testing & Concept Applications",
    members: ["Joseph Alex", "Joseph J"],
    role: "Hardware Sourcing, Bench Testing & Use-Case Mapping",
    contribution: "Joseph Alex spent two weeks acquiring Arduino Nano boards, LEDs, resistors, and buzzers while testing voltage levels and continuity. Joseph J researched real-world CRT applications across ITS traffic systems and fiber-optic telecommunications.",
  },
  {
    subteam: "Web Design & Frontend Engine Development",
    members: ["Johan Geo", "Johaan Sam"],
    role: "UI/UX Architecture & React State Engine",
    contribution: "Johan spent the first two weeks designing visual layouts, dark themes, and SVG circular monitors. Johaan spent three weeks engineering the React 19 state engine, 60 FPS animation loops, and dynamic CRT remainder solver.",
  },
  {
    subteam: "Presentation Structure & Showcase Lead",
    members: ["Joel Geo Manuel"],
    role: "Presentation Pacing & Live Demo Walkthrough",
    contribution: "Authored the 2-speaker showcase script between driver Alex and tech lead Sam over multiple group rehearsal sessions, structuring demo pacing around 3s/5s/7s signal cycles and coordinating acoustic chime feedback.",
  },
  {
    subteam: "Mathematics, Proofs & Pedagogical Design",
    members: ["Joel Duke", "Jose Alex", "Jyothika Prakash"],
    role: "Number Theory, Formal Proofs & Educational Engine",
    contribution: "Joel Duke led initial research and formulated system congruences with Extended Euclidean inverses. Jose spent hours verifying solution existence/uniqueness bounds modulo 105. Jyothika spent three weeks authoring the 3-tier educational hint engine.",
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
