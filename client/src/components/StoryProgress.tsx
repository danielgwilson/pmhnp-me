import { FC, useEffect, useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StoryProgressProps {
  total: number;
  current: number;
  onComplete?: () => void;
  isPaused?: boolean;
  autoProgress?: boolean;
}

const PROGRESS_DURATION = 5000; // 5 seconds per slide
const PROGRESS_INTERVAL = 50; // Update every 50ms
const PROGRESS_STEP = (100 * PROGRESS_INTERVAL) / PROGRESS_DURATION;

export const StoryProgress: FC<StoryProgressProps> = ({
  total,
  current,
  onComplete,
  isPaused = false,
  autoProgress = false,
}) => {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    // Reset progress when current slide changes
    setProgress(0);
    completedRef.current = false;
  }, [current]);

  useEffect(() => {
    // Don't continue timer if paused
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + PROGRESS_STEP);

        // Only auto-complete if autoProgress is enabled
        if (next >= 100 && !completedRef.current && autoProgress) {
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
    };
  }, [current, onComplete, isPaused, autoProgress]);

  // Calculate overall progress including completed slides
  const overallProgress = ((current + progress / 100) / total) * 100;

  return (
    <div className="w-full px-4">
      {/* Show continuous bar on mobile for long quizzes */}
      <div className="md:hidden">
        {total > 5 ? (
          <Progress
            value={overallProgress}
            className="h-1 bg-gray-600 [&>div]:bg-white"
          />
        ) : (
          <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <Progress
                key={i}
                value={i === current ? progress : i < current ? 100 : 0}
                className={cn(
                  'h-1',
                  i === current || i < current
                    ? 'bg-gray-600 [&>div]:bg-white'
                    : 'bg-gray-600'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Always show segmented bars on desktop */}
      <div className="hidden md:flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <Progress
            key={i}
            value={i === current ? progress : i < current ? 100 : 0}
            className={cn(
              'h-1',
              i === current || i < current
                ? 'bg-gray-600 [&>div]:bg-white'
                : 'bg-gray-600'
            )}
          />
        ))}
      </div>
    </div>
  );
};
