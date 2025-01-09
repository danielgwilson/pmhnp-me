import { FC, useRef, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Topic } from '@/data/topics';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageFallback } from '@/components/ui/image-fallback';

interface TopicCirclesProps {
  topics: Topic[];
}

export const TopicCircles: FC<TopicCirclesProps> = ({ topics }) => {
  const [_, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftChevron(scrollLeft > 0);
    setShowRightChevron(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const handleImageError = (topicId: string) => {
    setFailedImages(prev => new Set([...prev, topicId]));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -200 : 200;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="relative max-w-md mx-auto">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 p-4 no-scrollbar scroll-smooth relative"
        onScroll={handleScroll}
      >
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
            onClick={() => setLocation(`/story/${topic.id}`)}
          >
            <div className="rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500">
              <Avatar className="w-16 h-16 border border-white">
                {topic.imageUrl && !failedImages.has(topic.id) ? (
                  <AvatarImage 
                    src={topic.imageUrl} 
                    alt={topic.title}
                    onError={() => handleImageError(topic.id)}
                    loading="lazy"
                  />
                ) : (
                  <AvatarFallback>
                    <ImageFallback title={topic.title} />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <span className="text-xs truncate max-w-[64px] text-center">
              {topic.title}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute -left-8 top-1/2 -translate-y-1/2 bg-background shadow-lg hover:bg-background z-10 rounded-full",
            !showLeftChevron && "hidden"
          )}
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute -right-8 top-1/2 -translate-y-1/2 bg-background shadow-lg hover:bg-background z-10 rounded-full",
            !showRightChevron && "hidden"
          )}
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};