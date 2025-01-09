import { FC } from 'react';
import { useLocation } from 'wouter';
import { Topic } from '@/data/topics';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface TopicCirclesProps {
  topics: Topic[];
}

export const TopicCircles: FC<TopicCirclesProps> = ({ topics }) => {
  const [_, setLocation] = useLocation();

  return (
    <div className="flex overflow-x-auto gap-4 p-4 no-scrollbar">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => setLocation(`/story/${topic.id}`)}
        >
          <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarImage src={topic.imageUrl} alt={topic.title} />
              <AvatarFallback>{topic.title[0]}</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-xs truncate max-w-[64px] text-center">
            {topic.title}
          </span>
        </div>
      ))}
    </div>
  );
};
