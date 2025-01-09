import { FC, useState } from 'react';
import { Input } from '@/components/ui/input';
import { TopicFeed } from '@/components/TopicFeed';
import { mockTopics } from '@/data/topics';

export const Search: FC = () => {
  const [search, setSearch] = useState('');

  const filteredTopics = mockTopics.filter(
    topic =>
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 pb-20">
      <Input
        type="search"
        placeholder="Search topics..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <TopicFeed topics={filteredTopics} />
    </div>
  );
};
