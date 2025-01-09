import { FC } from 'react';
import { useLocation } from 'wouter';
import { Topic } from '@/data/topics';
import { Card, CardContent } from '@/components/ui/card';

interface TopicFeedProps {
  topics: Topic[];
  compact?: boolean;
}

export const TopicFeed: FC<TopicFeedProps> = ({ topics, compact }) => {
  const [_, setLocation] = useLocation();

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      {topics.map((topic) => (
        <Card
          key={topic.id}
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setLocation(`/story/${topic.id}`)}
        >
          <CardContent className="p-0">
            {!compact && (
              <div className="aspect-[4/3] relative">
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4 flex items-center gap-4">
              {compact && (
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{topic.title}</h3>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};