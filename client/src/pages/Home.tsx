import { FC } from 'react';
import { TopicCircles } from '@/components/TopicCircles';
import { TopicFeed } from '@/components/TopicFeed';
import { mockTopics } from '@/data/topics';

export const Home: FC = () => {
  return (
    <div className="pb-20">
      <h1 className="p-4 text-2xl font-semibold">PMHNP-BC Training</h1>
      <TopicCircles topics={mockTopics} />
      <TopicFeed topics={mockTopics} />
    </div>
  );
};
