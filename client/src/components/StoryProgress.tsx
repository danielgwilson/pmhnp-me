import { FC, useEffect, useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';

interface StoryProgressProps {
  total: number;
  current: number;
  onComplete?: () => void;
}

const PROGRESS_DURATION = 5000; // 5 seconds per slide
const PROGRESS_INTERVAL = 50; // Update every 50ms
const PROGRESS_STEP = (100 * PROGRESS_INTERVAL) / PROGRESS_DURATION;

export const StoryProgress: FC<StoryProgressProps> = ({
  total,
  current,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    setProgress(0);
    completedRef.current = false;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + PROGRESS_STEP);

        if (next >= 100 && !completedRef.current) {
          completedRef.current = true;
          clearInterval(timer);
          if (onComplete) {
            onComplete();
          }
        }
        return next;
      });
    }, PROGRESS_INTERVAL);

    return () => {
      clearInterval(timer);
      completedRef.current = false;
    };
  }, [current, onComplete]);

  return (
    <div className="w-full px-4 flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <Progress
          key={i}
          value={i === current ? progress : i < current ? 100 : 0}
          className="h-1 bg-gray-600"
        />
      ))}
    </div>
  );
};
