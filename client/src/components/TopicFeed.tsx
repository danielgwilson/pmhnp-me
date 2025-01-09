import { FC } from 'react';
import { useLocation } from 'wouter';
import { Topic } from '@/data/topics';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Heart } from 'lucide-react';
import { getMessageCount, getLikes, toggleLike } from '@/lib/storage';

interface TopicFeedProps {
  topics: Topic[];
  compact?: boolean;
}

export const TopicFeed: FC<TopicFeedProps> = ({ topics, compact }) => {
  const [_, setLocation] = useLocation();

  const handleDoubleTap = (topicId: string, e: React.MouseEvent) => {
    if (e.detail === 2) {
      toggleLike(topicId);
      // Force a re-render
      e.currentTarget.click();
    }
  };

  const handleChatClick = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(`/story/${topicId}`);
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      {topics.map((topic) => (
        <Card
          key={topic.id}
          className="cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
          onClick={(e) => {
            handleDoubleTap(topic.id, e);
            if (e.detail === 1) {
              setLocation(`/story/${topic.id}`);
            }
          }}
        >
          <CardContent className="p-0">
            {!compact && (
              <div className="aspect-[4/3] relative">
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
            )}
            <div className="p-4 flex items-center gap-4">
              {compact && (
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{topic.title}</h3>
                  <div className="flex items-center gap-3">
                    <button 
                      className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={(e) => handleChatClick(topic.id, e)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {getMessageCount(topic.id)}
                    </button>
                    <button className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Heart 
                        className={`w-4 h-4 mr-1 ${getLikes(topic.id) > 0 ? 'fill-current text-red-500' : ''}`}
                      />
                      {getLikes(topic.id)}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};