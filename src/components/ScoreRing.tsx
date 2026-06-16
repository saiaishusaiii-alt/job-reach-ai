import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  label?: string;
}

const ScoreRing = ({ score, size = 140, label = 'Score' }: ScoreRingProps) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color = useMemo(() => {
    if (score < 40) return '#ef4444';
    if (score < 70) return '#f59e0b';
    if (score < 85) return '#10b981';
    return '#7c3aed';
  }, [score]);

  const colorName = useMemo(() => {
    if (score < 40) return 'red';
    if (score < 70) return 'amber';
    if (score < 85) return 'green';
    return 'violet';
  }, [score]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className={`text-3xl font-bold text-${colorName}-400`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {Math.round(score)}
          </motion.div>
          <div className="text-xs text-slate-400">/100</div>
        </div>
      </div>
      {label && <p className="text-sm text-slate-400 mt-4">{label}</p>}
    </div>
  );
};

export default ScoreRing;
