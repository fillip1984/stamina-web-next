import { motion } from "motion/react";

export default function ProgressBadge({
  progress,
  icon,
}: {
  progress: number;
  icon: React.ReactNode;
}) {
  const circumference = 2 * Math.PI * 45; // circumference = 2πr, where r = 45
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div>
      <div className="relative flex h-22.5 w-22.5 items-center justify-center">
        <motion.svg
          className="absolute -rotate-90"
          width="90"
          height="90"
          viewBox="0 0 112 112"
          initial="hidden"
          animate="visible"
        >
          {/* radial progress empty bar */}
          <circle
            cx="56"
            cy="56"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-900"
          />
          {/* radial progress filled bar */}
          <motion.circle
            cx="56"
            cy="56"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-green-500"
            initial={{ strokeDashoffset: circumference, opacity: 0 }}
            animate={{ strokeDashoffset: offset, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: "easeOut",
              type: "spring",
              bounce: progress > 5 && progress < 95 ? 0.3 : 0, // <-- overshooting causes visual glitches at extreme values
            }}
          />
        </motion.svg>

        {/* centered content showing icon and progress */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-full">
          {icon}
          <span className="text-xs font-semibold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
