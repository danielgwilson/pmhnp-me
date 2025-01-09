import { FC, useState } from 'react';
import { Input } from '@/components/ui/input';
import { TopicFeed } from '@/components/TopicFeed';
import { mockTopics } from '@/data/topics';
import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command';

export const Search: FC = () => {
  const [search, setSearch] = useState('');

  const filteredTopics = mockTopics.filter(
    topic =>
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 pb-20">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search topics..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {search && filteredTopics.map((topic) => (
            <CommandItem
              key={topic.id}
              value={topic.title}
              className="cursor-pointer"
              onSelect={() => setSearch(topic.title)}
            >
              {topic.title}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
      <div className="mt-4">
        <TopicFeed topics={filteredTopics} compact />
      </div>
    </div>
  );
};