import { motion } from "framer-motion";

interface DoorProps {
  open: boolean;
  latchReleased: boolean;
  secretNumber: number;
}

export function Door({ open, latchReleased, secretNumber }: DoorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-bold tracking-[0.14em] text-[#8a6f45] uppercase">Door</span>
      <div
        className="relative h-40 w-28 sm:h-48 sm:w-32"
        style={{ perspective: "800px" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-[#8a6f45]/50 bg-[#3a2c1a] p-3 text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
          <span className="text-[9px] font-bold tracking-[0.2em] text-[#c99a65] uppercase">
            {open ? "Lock Open" : "Secret Number"}
          </span>
          <motion.span
            initial={false}
            animate={open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ delay: open ? 0.35 : 0, duration: 0.4, type: "spring" }}
            className="text-3xl font-extrabold text-[#f4e9d4] sm:text-4xl"
          >
            {secretNumber}
          </motion.span>
          {open && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-[9px] font-medium text-[#a3936f]"
            >
              CRT solved
            </motion.span>
          )}
        </div>

        <motion.div
          className="absolute inset-0 rounded-sm border-2 border-[#8a5f38] shadow-[2px_2px_0_rgba(0,0,0,0.15),0_8px_16px_-4px_rgba(60,40,10,0.4)]"
          style={{
            background:
              "linear-gradient(135deg, #c99a65 0%, #b88955 45%, #a87543 100%)",
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateY: open ? -108 : 0 }}
          transition={{ duration: 0.9, ease: [0.34, 1, 0.4, 1], delay: open ? 0.15 : 0 }}
        >
          <div className="absolute inset-2 rounded-[2px] border border-[#8a5f38]/60" />
          <div
            className={`absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 rounded-full border shadow-sm transition-colors duration-300 ${
              latchReleased ? "border-[#3f9a52] bg-[#6fc47a]" : "border-[#6b4620] bg-[#8b8b83]"
            }`}
          />
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-bold tracking-[0.14em] text-[#5c3f22] uppercase">
            CRT Lock
          </span>
        </motion.div>
      </div>
      <span
        className={`text-[10px] font-bold uppercase transition-colors ${open ? "text-[#3f9a52]" : "text-[#a8432f]"}`}
      >
        {open ? "Unlocked" : "Locked"}
      </span>
    </div>
  );
}
