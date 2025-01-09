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
import { updateDailyProgress, updateStreak, checkAndUnlockAchievements } from '@/lib/gamification';
import { showAchievementToast } from '@/components/AchievementToast';

interface TopicStoryProps {
  topic: Topic;
}

export const TopicStory: FC<TopicStoryProps> = ({ topic }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [_, setLocation] = useLocation();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    addToHistory(topic.id);
    const progress = updateDailyProgress('topic');
    const streak = updateStreak(progress.topicsStudied);
    const newAchievements = checkAndUnlockAchievements();
    newAchievements.forEach(achievement => {
      showAchievementToast(achievement);
    });
  }, [topic.id]);

  const handleProgressComplete = () => {
    if (currentSlide < topic.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setLocation('/');
    }
  };

  const handleTap = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relativeX = x / rect.width;

    if (relativeX < 0.25 && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (relativeX >= 0.25) {
      handleProgressComplete();
    }
  };

  const handleChatSubmit = async (message: string) => {
    updateDailyProgress('question');
    const newAchievements = checkAndUnlockAchievements();
    newAchievements.forEach(achievement => {
      showAchievementToast(achievement);
    });
  };


  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-black text-white"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
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
            <h2 className="text-lg font-semibold max-w-xs text-center mx-auto">{topic.title}</h2>
            <div className="w-6" />
          </div>

          <StoryProgress
            total={topic.slides.length}
            current={currentSlide}
            onComplete={handleProgressComplete}
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

          <div className="border-t border-white/10">
            <div className="flex items-center gap-4 px-4 py-2">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-white hover:text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <span className="ml-1 text-sm">4</span>
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-white hover:text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                  </svg>
                  <span className="ml-1 text-sm">0</span>
                </Button>
              </div>
            </div>

            <div className="p-4 pt-2">
              <Input
                className="w-full bg-transparent border-white/20 text-white placeholder:text-gray-400"
                placeholder="Ask a question about this topic..."
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChat(true);
                }}
              />
            </div>
          </div>
        </div>

        <StoryChat
          topicId={topic.id}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          onSubmit={handleChatSubmit}
        />
      </motion.div>
    </AnimatePresence>
  );
};