import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { mockTopics } from '@/data/topics';
import { getHistory } from '@/lib/storage';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { ImageFallback } from '@/components/ui/image-fallback';
import { Flame } from 'lucide-react';

export const Profile: FC = () => {
  const history = getHistory();
  const viewedTopics = mockTopics.filter(topic => history.includes(topic.id));

  // Calculate total slides viewed (assuming each topic has slides array)
  const totalSlidesViewed = viewedTopics.reduce((total, topic) => total + topic.slides.length, 0);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      {/* Progress Stats */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Learning Progress</h2>
              <p className="text-sm text-muted-foreground">
                Keep going! You're making great progress.
              </p>
            </div>
            {/* Progress Circle */}
            <ProgressCircle 
              progress={(viewedTopics.length / mockTopics.length) * 100} 
              size={80} 
              strokeWidth={8}
            >
              <div className="text-center">
                <span className="text-lg font-semibold">
                  {Math.round((viewedTopics.length / mockTopics.length) * 100)}%
                </span>
              </div>
            </ProgressCircle>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{viewedTopics.length}</p>
              <p className="text-sm text-muted-foreground">Topics Completed</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{totalSlidesViewed}</p>
              <p className="text-sm text-muted-foreground">Slides Viewed</p>
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
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageFallback
                    title={topic.title}
                    imageUrl={topic.imageUrl}
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