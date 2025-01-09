import { FC, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Topic } from '@/data/topics';
import { StoryProgress } from './StoryProgress';
import { StoryChat } from './StoryChat';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { addToHistory } from '@/lib/storage';

interface TopicStoryProps {
  topic: Topic;
}

export const TopicStory: FC<TopicStoryProps> = ({ topic }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [_, setLocation] = useLocation();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    addToHistory(topic.id);
  }, [topic.id]);

  const handleTap = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;

    if (x < third && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (x > third * 2 && currentSlide < topic.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white">
      <div className="h-full flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setLocation('/')}
          >
            <X className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-semibold">{topic.title}</h2>
          <div className="w-6" />
        </div>

        <StoryProgress
          total={topic.slides.length}
          current={currentSlide}
        />

        <div
          className="flex-1 relative"
          onClick={handleTap}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <p className="text-lg text-center">
              {topic.slides[currentSlide].content}
            </p>
          </div>

          <div className="absolute inset-y-0 left-0 w-1/3 flex items-center justify-start p-4 opacity-50">
            {currentSlide > 0 && <ChevronLeft className="h-8 w-8" />}
          </div>

          <div className="absolute inset-y-0 right-0 w-1/3 flex items-center justify-end p-4 opacity-50">
            {currentSlide < topic.slides.length - 1 && <ChevronRight className="h-8 w-8" />}
          </div>
        </div>

        <div className="p-4">
          <Button
            variant="outline"
            className="w-full text-white border-white"
            onClick={() => setShowChat(true)}
          >
            Ask a question about this topic
          </Button>
        </div>
      </div>

      <StoryChat
        topicId={topic.id}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
};
