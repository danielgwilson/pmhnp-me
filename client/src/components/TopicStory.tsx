import { FC, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Topic } from '@/data/topics';
import { StoryProgress } from './StoryProgress';
import { StoryChat } from './StoryChat';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { addToHistory } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < topic.slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        setLocation('/');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSlide, topic.slides.length, setLocation]);

  const handleTap = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relativeX = x / rect.width;

    if (relativeX < 0.25 && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (relativeX >= 0.25) {
      if (currentSlide < topic.slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        setLocation('/');
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 text-white" // Added background blur
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ zIndex: 50 }}
      >
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
            <h2 className="text-lg font-semibold max-w-xs text-center mx-auto">{topic.title}</h2> {/* Centered and max-width */}
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
          </div>

          <div className="p-4">
            <Input
              className="w-full bg-transparent border-white text-white placeholder:text-gray-400"
              placeholder="Ask a question about this topic..."
              onClick={(e) => {
                e.stopPropagation();
                setShowChat(true);
              }}
            />
          </div>
        </div>

        <StoryChat
          topicId={topic.id}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
};