import { FC, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { TopicFeed } from '@/components/TopicFeed';
import { mockTopics } from '@/data/topics';
import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [chevronStates, setChevronStates] = useState<{ left: boolean; right: boolean }[]>(
    categories.map(() => ({ left: false, right: true }))
  );

  const handleScroll = (index: number) => {
    const ref = scrollRefs.current[index];
    if (!ref) return;

    const { scrollLeft, scrollWidth, clientWidth } = ref;
    setChevronStates(prev => {
      const newStates = [...prev];
      newStates[index] = {
        left: scrollLeft > 0,
        right: scrollLeft + clientWidth < scrollWidth - 10
      };
      return newStates;
    });
  };

  const scroll = (index: number, direction: 'left' | 'right') => {
    const ref = scrollRefs.current[index];
    if (!ref) return;
    const offset = direction === 'left' ? -300 : 300;
    ref.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const filteredTopics = mockTopics.filter(
    topic =>
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 pb-20">
      <Command className="rounded-lg border shadow-none">
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
          {categories.map((category, index) => (
            <div key={category.title} className="relative">
              <ScrollArea className="w-full whitespace-nowrap">
                <div
                  ref={el => scrollRefs.current[index] = el}
                  className="flex w-full gap-4 scroll-smooth relative"
                  onScroll={() => handleScroll(index)}
                >
                  {category.topics.map((topic) => (
                    <Card 
                      key={topic.id}
                      className="w-[250px] flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                      onClick={() => setLocation(`/story/${topic.id}`)}
                    >
                      <div className="aspect-video relative bg-muted">
                        {topic.imageUrl ? (
                          <img
                            src={topic.imageUrl}
                            alt={topic.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-semibold text-muted-foreground">
                              {topic.title.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium truncate">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {topic.description}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "absolute -left-4 top-1/2 -translate-y-1/2 bg-background shadow-lg hover:bg-background z-10 rounded-full",
                    !chevronStates[index]?.left && "hidden"
                  )}
                  onClick={() => scroll(index, 'left')}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "absolute -right-4 top-1/2 -translate-y-1/2 bg-background shadow-lg hover:bg-background z-10 rounded-full",
                    !chevronStates[index]?.right && "hidden"
                  )}
                  onClick={() => scroll(index, 'right')}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
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