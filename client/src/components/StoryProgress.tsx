import { FC, useEffect, useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';

interface StoryProgressProps {
  total: number;
  current: number;
  onComplete?: () => void;
}

export const StoryProgress: FC<StoryProgressProps> = ({ total, current, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    setProgress(0);
    completedRef.current = false;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (!completedRef.current) {
            completedRef.current = true;
            // Schedule onComplete callback to avoid state updates during render
            if (onComplete) {
              setTimeout(onComplete, 0);
            }
          }
          return 100;
        }
        return prev + 1;
      });
    }, 50);

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