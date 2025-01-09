import { FC, useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface StoryProgressProps {
  total: number;
  current: number;
}

export const StoryProgress: FC<StoryProgressProps> = ({ total, current }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [current]);

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
