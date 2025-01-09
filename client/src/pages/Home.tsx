import { FC, useState, useEffect } from 'react';
import { TopicCircles } from '@/components/TopicCircles';
import { TopicFeed } from '@/components/TopicFeed';
import { DailyProgress } from '@/components/DailyProgress';
import { mockTopics } from '@/data/topics';

export const Home: FC = () => {
  const [randomizedTopics, setRandomizedTopics] = useState(mockTopics);

  useEffect(() => {
    setRandomizedTopics([...mockTopics].sort(() => Math.random() - 0.5));
  }, []);

  return (
    <div className="pb-20">
      <div className="px-4 mb-4">
        <DailyProgress />
      </div>
      <TopicCircles topics={mockTopics} />
      <TopicFeed topics={randomizedTopics} />
    </div>
  );
};