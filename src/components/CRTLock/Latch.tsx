import { motion } from "framer-motion";

interface LatchProps {
  released: boolean;
}

export function Latch({ released }: LatchProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-bold tracking-[0.14em] text-[#8a6f45] uppercase">Latch</span>
      <div className="relative h-12 w-8 rounded-sm border-2 border-[#5f5f58] bg-[#3d3d38] shadow-inner">
        <motion.div
          className="absolute left-1/2 h-6 w-4 -translate-x-1/2 rounded-sm border border-[#7a4f22]"
          style={{ background: "linear-gradient(180deg,#d9c08a,#a5652b)" }}
          animate={{ top: released ? -2 : 10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
      <span
        className={`text-[10px] font-bold uppercase transition-colors ${released ? "text-[#3f9a52]" : "text-[#a8432f]"}`}
      >
        {released ? "Released" : "Engaged"}
      </span>
    </div>
  );
}
