import { FC, useState } from 'react';
import { useLocation } from 'wouter';
import { TopicFeed } from '@/components/TopicFeed';
import { mockTopics } from '@/data/topics';
import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface TopicCategory {
  title: string;
  topics: typeof mockTopics;
}

const categories: TopicCategory[] = [
  {
    title: "Most Popular",
    topics: mockTopics.slice(0, 3)
  },
  {
    title: "Recently Added",
    topics: [...mockTopics].reverse().slice(0, 3)
  },
  {
    title: "Recommended",
    topics: [...mockTopics].sort(() => Math.random() - 0.5).slice(0, 3)
  }
];

export const Search: FC = () => {
  const [search, setSearch] = useState('');
  const [_, setLocation] = useLocation();

  const filteredTopics = mockTopics.filter(
    topic =>
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 pb-20">
      <Command>
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
              onSelect={() => {
                setLocation(`/story/${topic.id}`);
                setSearch('');
              }}
            >
              {topic.title}
            </CommandItem>
          ))}
        </CommandList>
      </Command>

      {!search && (
        <div className="mt-6 space-y-6">
          {categories.map((category) => (
            <div key={category.title}>
              {/* Removed h2 title */}
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-full gap-4">
                  {category.topics.map((topic) => (
                    <Card 
                      key={topic.id}
                      className="w-[250px] flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                      onClick={() => setLocation(`/story/${topic.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video mb-2">
                          <img
                            src={topic.imageUrl}
                            alt={topic.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="font-medium truncate">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {topic.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          ))}
        </div>
      )}

      {search && (
        <div className="mt-4">
          <TopicFeed topics={filteredTopics} compact />
        </div>
      )}
    </div>
  );
};