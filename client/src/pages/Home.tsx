import { FC } from 'react';
import { TopicCircles } from '@/components/TopicCircles';
import { TopicFeed } from '@/components/TopicFeed';
import { useFeed } from '@/lib/FeedContext';

interface HomeProps {
  setActiveStory: (id: string | null) => void;
}

export const Home: FC<HomeProps> = ({ setActiveStory }) => {
  const { feedTopics, topicCircles } = useFeed();

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <TopicCircles topics={topicCircles} />
      <TopicFeed topics={feedTopics} setActiveStory={setActiveStory} />
    </div>
  );
};
