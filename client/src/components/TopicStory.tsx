import { FC, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Topic } from '@/data/topics';
import { StoryProgress } from './StoryProgress';
import { StoryChat } from './StoryChat';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { addToHistory, getLikes, toggleLike, getMessageCount } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { updateDailyProgress, updateStreak, checkAndUnlockAchievements } from '@/lib/gamification';
import { showAchievementToast } from '@/components/AchievementToast';
import { Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicStoryProps {
  topic: Topic;
}

export const TopicStory: FC<TopicStoryProps> = ({ topic }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [_, setLocation] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [likeCount, setLikeCount] = useState(getLikes(topic.id));
  const [messageCount, setMessageCount] = useState(getMessageCount(topic.id));
  const [isExiting, setIsExiting] = useState(false);

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
      handleClose();
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    // Use history.back() to avoid re-rendering the feed
    setTimeout(() => {
      window.history.back();
    }, 150); // Match the exit animation duration
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
    setMessageCount(getMessageCount(topic.id));
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikeCount = toggleLike(topic.id);
    setLikeCount(newLikeCount);
  };

  return (
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
            className="text-white hover:text-white hover:bg-white/20"
            onClick={handleClose}
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
          <div className="flex items-center gap-4 p-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLikeClick}
                className="hover:opacity-70 transition-opacity"
              >
                <Heart 
                  className={cn(
                    "w-6 h-6 text-white",
                    likeCount > 0 ? "fill-red-500" : "fill-none"
                  )}
                />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChat(true);
                }}
                className="hover:opacity-70 transition-opacity"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <div className="px-4 pb-2">
            <div className="text-sm font-semibold text-white mb-2">
              {likeCount} likes · {messageCount} questions
            </div>
          </div>

          <div className="p-4 pt-0">
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
  );
};