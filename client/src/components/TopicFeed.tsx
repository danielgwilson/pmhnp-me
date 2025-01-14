import { FC, useState } from 'react';
import { useLocation } from 'wouter';
import { Topic } from '@/data/topics';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Heart } from 'lucide-react';
import { getMessageCount, getLikes, toggleLike } from '@/lib/storage';
import { ImageFallback } from '@/components/ui/image-fallback';
import { cn } from '@/lib/utils';

interface TopicFeedProps {
  topics: Topic[];
  compact?: boolean;
  setActiveStory: (id: string | null) => void;
}

export const TopicFeed: FC<TopicFeedProps> = ({
  topics,
  compact,
  setActiveStory,
}) => {
  const [_, setLocation] = useLocation();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(
    topics.reduce(
      (acc, topic) => ({ ...acc, [topic.id]: getLikes(topic.id) }),
      {}
    )
  );

  const handleImageError = (topicId: string) => {
    setFailedImages((prev) => new Set([...prev, topicId]));
  };

  const handleDoubleTap = (topicId: string, e: React.MouseEvent) => {
    if (e.detail === 2) {
      handleLikeClick(topicId, e);
    }
  };

  const handleChatClick = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStory(topicId);
  };

  const handleLikeClick = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikeCount = toggleLike(topicId);
    setLikeCounts((prev) => ({ ...prev, [topicId]: newLikeCount }));
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      {topics.map((topic) => (
        <Card
          key={topic.id}
          className="cursor-pointer overflow-hidden"
          onClick={(e) => {
            handleDoubleTap(topic.id, e);
            if (e.detail === 1) {
              setActiveStory(topic.id);
            }
          }}>
          <CardContent className="p-0">
            {!compact && (
              <div className="aspect-[4/3] relative">
                {topic.imageUrl && !failedImages.has(topic.id) ? (
                  <img
                    src={topic.imageUrl}
                    alt={topic.title}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(topic.id)}
                    loading="lazy"
                  />
                ) : (
                  <ImageFallback title={topic.title} className="rounded-t-lg" />
                )}
              </div>
            )}

            {/* Instagram-style interaction buttons */}
            <div className="p-3">
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={(e) => handleLikeClick(topic.id, e)}
                  className="hover:opacity-70 transition-opacity">
                  <Heart
                    className={cn(
                      'w-6 h-6',
                      likeCounts[topic.id] > 0
                        ? 'fill-red-500 text-red-500'
                        : 'text-foreground'
                    )}
                  />
                </button>
                <button
                  onClick={(e) => handleChatClick(topic.id, e)}
                  className="hover:opacity-70 transition-opacity">
                  <MessageCircle className="w-6 h-6 text-foreground" />
                </button>
              </div>

              {/* Like count */}
              <div className="text-sm font-semibold mb-1">
                {likeCounts[topic.id]} likes
              </div>

              {/* Content */}
              <div className="flex items-start gap-3">
                {compact && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    {topic.imageUrl && !failedImages.has(topic.id) ? (
                      <img
                        src={topic.imageUrl}
                        alt={topic.title}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(topic.id)}
                        loading="lazy"
                      />
                    ) : (
                      <ImageFallback title={topic.title} />
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {topic.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getMessageCount(topic.id)} questions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
