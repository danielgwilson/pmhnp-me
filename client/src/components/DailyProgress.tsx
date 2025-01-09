import { FC, useEffect, useState } from 'react';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { Card } from '@/components/ui/card';
import { getDailyProgress, getStreakStatus } from '@/lib/gamification';
import { Flame } from 'lucide-react';

export const DailyProgress: FC = () => {
  const [progress, setProgress] = useState(getDailyProgress());
  const [streak, setStreak] = useState(getStreakStatus());

  useEffect(() => {
    const updateProgress = () => {
      setProgress(getDailyProgress());
      setStreak(getStreakStatus());
    };

    // Update on mount and when storage changes
    updateProgress();
    window.addEventListener('storage', updateProgress);
    return () => window.removeEventListener('storage', updateProgress);
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Daily Goal</h3>
          <p className="text-sm text-muted-foreground">
            Study {3 - progress.topicsStudied} more topics today
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Streak indicator */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{streak.currentStreak}</span>
            </div>
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          {/* Progress circle */}
          <ProgressCircle progress={progress.goalProgress} size={64} strokeWidth={6}>
            <span className="text-sm font-medium">
              {Math.round(progress.goalProgress)}%
            </span>
          </ProgressCircle>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-2xl font-bold">{progress.topicsStudied}</p>
          <p className="text-sm text-muted-foreground">Topics Studied</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{progress.questionsAsked}</p>
          <p className="text-sm text-muted-foreground">Questions Asked</p>
        </div>
      </div>
    </Card>
  );
};
