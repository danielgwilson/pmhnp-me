import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { mockTopics } from '@/data/topics';
import { getHistory } from '@/lib/storage';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { getDailyProgress, getStreakStatus } from '@/lib/gamification';
import { Flame } from 'lucide-react';

export const Profile: FC = () => {
  const history = getHistory();
  const progress = getDailyProgress();
  const streak = getStreakStatus();
  const viewedTopics = mockTopics.filter(topic => history.includes(topic.id));

  return (
    <div className="p-4 pb-20 max-w-2xl mx-auto">
      {/* Daily Progress & Streak */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Daily Goal</h2>
              <p className="text-sm text-muted-foreground">
                Study {3 - progress.topicsStudied} more topics today
              </p>
            </div>
            <div className="flex items-center gap-6">
              {/* Streak */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-6 h-6" />
                  <span className="text-xl font-bold">{streak.currentStreak}</span>
                </div>
                <span className="text-xs text-muted-foreground">Day Streak</span>
              </div>
              {/* Progress Circle */}
              <ProgressCircle 
                progress={progress.goalProgress} 
                size={80} 
                strokeWidth={8}
              >
                <div className="text-center">
                  <span className="text-lg font-semibold">
                    {Math.round(progress.goalProgress)}%
                  </span>
                </div>
              </ProgressCircle>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{progress.topicsStudied}</p>
              <p className="text-sm text-muted-foreground">Topics Today</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{progress.questionsAsked}</p>
              <p className="text-sm text-muted-foreground">Questions Asked</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recently Viewed Topics */}
      <h2 className="text-xl font-semibold mb-4">Recently Viewed Topics</h2>
      <div className="space-y-4">
        {viewedTopics.map((topic) => (
          <Card key={topic.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={topic.imageUrl}
                    alt={topic.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{topic.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};