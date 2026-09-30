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
    subteam: "Project Leadership & Model Construction",
    members: ["Justin Joe Mathew (Team Lead)", "Jyothis Liju"],
    role: "Working Model & System Architecture",
    contribution: "Justin led overall project execution and construction of the working traffic signal model, supported by Jyothis in physical mechanism logic and integration.",
  },
  {
    subteam: "Hardware Procurement, Testing & Concept Development",
    members: ["Joseph Alex", "Joseph J"],
    role: "Hardware Sourcing, Build Testing & Applications",
    contribution: "Decided required components/parts, handled hardware procurement, conducted build testing, and contributed to application ideas.",
  },
  {
    subteam: "Web Design & Frontend Development",
    members: ["Johan Geo", "Johaan Sam"],
    role: "UI/UX & Web Implementation",
    contribution: "Handled complete web design, component architecture, styling, and interactive dial/wheel frontend development.",
  },
  {
    subteam: "Presentation & Showcase Lead",
    members: ["Joel Geo Manuel"],
    role: "Project Presentation & Demo Coordination",
    contribution: "Managed the presentation design, live demo workflow, and script formulation for showcasing the traffic light sync concept.",
  },
  {
    subteam: "Mathematics & Applications Research",
    members: ["Joel Duke", "Jyothika Prakash", "Jose Alex"],
    role: "Number Theory & Real-World Use Cases",
    contribution: "Researched Chinese Remainder Theorem mathematics, modular congruences, and formulated real-world application models (e.g. Traffic Signals).",
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
