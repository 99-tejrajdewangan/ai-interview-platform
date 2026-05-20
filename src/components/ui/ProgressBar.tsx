import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function ProgressBar({ 
  progress, 
  showPercentage = false, 
  height = 'md',
  animated = true 
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const getColor = () => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heights[height]}`}>
        <motion.div
          className={`${getColor()} rounded-full ${heights[height]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={animated ? { duration: 0.5, ease: "easeOut" } : {}}
        />
      </div>
    </div>
  );
}