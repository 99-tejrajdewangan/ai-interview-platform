import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerProps {
  initialTime: number;
  autoStart?: boolean;
  onTimeEnd?: () => void;
  onTick?: (timeLeft: number) => void;
}

export function useTimer({ initialTime, autoStart = false, onTimeEnd, onTick }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) stopTimer();
    setIsRunning(true);
  }, [stopTimer]);

  const resetTimer = useCallback((newTime?: number) => {
    stopTimer();
    setTimeLeft(newTime !== undefined ? newTime : initialTime);
    if (autoStart) {
      startTimer();
    }
  }, [stopTimer, startTimer, initialTime, autoStart]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getTimeColor = useCallback((): string => {
    if (timeLeft <= 10) return 'text-red-600 dark:text-red-400';
    if (timeLeft <= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  }, [timeLeft]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          onTick?.(newTime);
          if (newTime <= 0) {
            stopTimer();
            onTimeEnd?.();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, stopTimer, onTimeEnd, onTick]);

  return {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
    getTimeColor,
    isTimeWarning: timeLeft <= 30,
    isTimeCritical: timeLeft <= 10,
    percentageLeft: (timeLeft / initialTime) * 100
  };
}