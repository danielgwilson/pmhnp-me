import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Topic } from '@/data/topics';
import { StoryProgress } from './StoryProgress';
import { StoryChat } from './StoryChat';
import { Button } from './ui/button';
import { X, Heart, MessageCircle, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { loadQuiz } from '@/lib/quiz-loader';
import { QuizChoice } from './quiz/quiz-choice';
import { cn } from '@/lib/utils';
import {
  getLikes,
  toggleLike,
  getMessageCount,
  saveSlidePosition,
  getSlidePosition,
} from '@/lib/storage';
import { useQuizProgress } from '@/hooks/use-quiz-progress';

interface TopicStoryProps {
  topic: Topic;
  onClose: () => void;
}

export const TopicStory = ({ topic, onClose }: TopicStoryProps) => {
  const [_, setLocation] = useLocation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(
    topic.resumable ? getSlidePosition(topic.id) : 0
  );
  const [showChat, setShowChat] = useState(false);
  const [likeCount, setLikeCount] = useState(getLikes(topic.id));
  const [messageCount, setMessageCount] = useState(getMessageCount(topic.id));
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [navType, setNavType] = useState<'forward' | 'backward'>('forward');
  const [isShuffled, setIsShuffled] = useState(false);

  const getTotalSlides = () => {
    if (topic.type === 'slides' && topic.slides) {
      return topic.slides.length;
    }
    if (topic.type === 'quiz' && quiz.data) {
      return quiz.data.questions.length;
    }
    return 0;
  };

  const handleProgressComplete = useCallback(() => {
    if (currentSlideIndex === getTotalSlides() - 1) {
      onClose();
    } else {
      handleNextSlide();
    }
  }, [currentSlideIndex, getTotalSlides, onClose]);

  const quiz = useQuery({
    queryKey: ['quiz', topic.quizId],
    queryFn: () => loadQuiz(topic.quizId!),
    enabled: topic.type === 'quiz' && !!topic.quizId,
  });

  const { saveAnswer, getQuestionProgress } = useQuizProgress(
    topic.quizId ?? ''
  );

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikeCount = toggleLike(topic.id);
    setLikeCount(newLikeCount);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setNavType('backward');
      if (topic.type === 'quiz' && quiz.data) {
        const questionIndex = Math.floor(currentSlideIndex / 3);
        const slideType = currentSlideIndex % 3;
        if (slideType === 2) {
          const question = quiz.data.questions[questionIndex];
          setSelectedAnswers((prev) => {
            const next = { ...prev };
            delete next[question.id];
            return next;
          });
          saveAnswer(question.id, '', false);
        }
      }
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const getNextSlideIndex = (current: number) => {
    const total = getTotalSlides();
    if (!isShuffled) return current + 1;

    // If we're on an explanation slide (slideType === 2), pick a random next question
    if (current % 3 === 2) {
      const currentQuestion = Math.floor(current / 3);
      const remainingQuestions = Array.from(
        { length: total },
        (_, i) => i * 3
      ).filter((i) => i !== currentQuestion * 3);

      return remainingQuestions[
        Math.floor(Math.random() * remainingQuestions.length)
      ];
    }

    // Otherwise just go to the next slide in sequence
    return current + 1;
  };

  const handleNextSlide = () => {
    setNavType('forward');

    if (currentSlideIndex === getTotalSlides() - 1) {
      onClose();
      return;
    }

    const nextIndex = getNextSlideIndex(currentSlideIndex);
    if (nextIndex < getTotalSlides()) {
      setCurrentSlideIndex(nextIndex);
    } else {
      onClose();
    }
  };

  const handleSelectAnswer = (
    questionId: string,
    answerId: string,
    isCorrect: boolean
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));

    saveAnswer(questionId, answerId, isCorrect);

    setTimeout(() => {
      setNavType('forward');
      const currentQuestionIndex = Math.floor(currentSlideIndex / 3);
      const nextSlideIndex = currentQuestionIndex * 3 + 2;
      setCurrentSlideIndex(nextSlideIndex);
    }, 1500);
  };

  const renderContent = () => {
    const actualIndex = getActualSlideIndex(currentSlideIndex);

    if (topic.type === 'slides' && topic.slides) {
      const slide = topic.slides[actualIndex];
      return (
        <div className="space-y-4 select-none">
          <p className="text-lg">{slide.content}</p>
          {slide.imageUrl && (
            <img
              src={slide.imageUrl}
              alt=""
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
        </div>
      );
    }

    if (topic.type === 'quiz' && quiz.data) {
      const questionIndex = Math.floor(actualIndex / 3);
      const slideType = actualIndex % 3;
      const question = quiz.data.questions[questionIndex];
      const selectedAnswer = selectedAnswers[question.id];

      switch (slideType) {
        case 0: // Prompt
          return (
            <div className="space-y-6 select-none">
              <h2 className="text-3xl font-bold">
                Question {question.questionNumber}
              </h2>
              <div
                className="text-xl leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: question.content.prompt.html,
                }}
              />
            </div>
          );
        case 1: // Choices
          return (
            <div className="space-y-4 select-none">
              {question.content.answers.map((answer) => (
                <QuizChoice
                  key={answer.id}
                  answer={answer}
                  isSelected={selectedAnswer === answer.id}
                  isRevealed={!!selectedAnswer}
                  onSelect={(answerId) =>
                    handleSelectAnswer(question.id, answerId, answer.isCorrect)
                  }
                  disabled={!!selectedAnswer}
                />
              ))}
            </div>
          );
        case 2: // Explanation
          const correctAnswer = question.content.answers.find(
            (a) => a.isCorrect
          );
          return (
            <div className="space-y-6 select-none">
              <div className="p-4 rounded-lg bg-primary/5 border">
                <h4 className="text-lg font-medium mb-2">Correct Answer:</h4>
                <p
                  className="text-lg"
                  dangerouslySetInnerHTML={{
                    __html: correctAnswer?.content.html ?? '',
                  }}
                />
              </div>
              {question.content.explanation && (
                <div
                  className="text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: question.content.explanation.html,
                  }}
                />
              )}
            </div>
          );
      }
    }

    return null;
  };

  const getCurrentSlideContent = () => {
    if (topic.type === 'slides' && topic.slides) {
      return topic.slides[currentSlideIndex].content;
    }
    if (topic.type === 'quiz' && quiz.data) {
      const questionIndex = Math.floor(currentSlideIndex / 3);
      const slideType = currentSlideIndex % 3;
      const question = quiz.data.questions[questionIndex];

      switch (slideType) {
        case 0: // Prompt
          return `Question ${question.questionNumber}: ${question.content.prompt.text}`;
        case 1: // Choices
          return `Question ${
            question.questionNumber
          } choices: ${question.content.answers
            .map((a) => a.content.text)
            .join(' | ')}`;
        case 2: // Explanation
          const correctAnswer = question.content.answers.find(
            (a) => a.isCorrect
          );
          return `Question ${question.questionNumber} explanation: ${
            correctAnswer?.content.text
          } - ${question.content.explanation?.text ?? ''}`;
      }
    }
    return undefined;
  };

  useEffect(() => {
    if (topic.resumable) {
      saveSlidePosition(topic.id, currentSlideIndex);
    }
  }, [topic.id, topic.resumable, currentSlideIndex]);

  // Get the actual slide index based on shuffle state
  const getActualSlideIndex = (index: number) => {
    if (!isShuffled) return index;
    return index;
  };

  if (topic.type === 'quiz' && quiz.isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      <div className="h-full flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/20 z-50"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}>
            <X className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-semibold max-w-xs text-center mx-auto">
            {topic.title}
          </h2>
          <div className="w-6" />
        </div>

        <div className="px-4">
          <StoryProgress
            total={getTotalSlides()}
            current={
              topic.type === 'quiz'
                ? Math.floor(currentSlideIndex / 3)
                : currentSlideIndex
            }
            onComplete={handleProgressComplete}
            isPaused={showChat}
            autoProgress={topic.autoProgress}
          />
        </div>

        <div className="flex-1 relative">
          <div className="absolute inset-0 z-10">
            <div
              className="absolute inset-y-0 left-0 w-1/4 pointer-events-auto"
              onClick={handlePrevSlide}
            />
            <div
              className="absolute inset-y-0 right-0 w-3/4 pointer-events-auto"
              onClick={
                currentSlideIndex === getTotalSlides() - 1
                  ? onClose
                  : handleNextSlide
              }
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-2xl mx-auto px-4">
              <AnimatePresence mode="wait" initial={false} custom={navType}>
                <motion.div
                  key={currentSlideIndex}
                  custom={navType}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={{
                    initial: (navType: 'forward' | 'backward') => ({
                      opacity: 0,
                      x: navType === 'forward' ? 100 : -100,
                    }),
                    animate: {
                      opacity: 1,
                      x: 0,
                    },
                    exit: (navType: 'forward' | 'backward') => ({
                      opacity: 0,
                      x: navType === 'forward' ? -100 : 100,
                    }),
                  }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                  }}
                  className="z-20 relative pointer-events-auto">
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={handleLikeClick}
              className="hover:opacity-70 transition-opacity z-20">
              <Heart
                className={cn(
                  'w-6 h-6 text-white',
                  likeCount > 0 ? 'fill-red-500' : 'fill-none'
                )}
              />
            </button>
            <button
              onClick={() => setShowChat(true)}
              className="hover:opacity-70 transition-opacity z-20">
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className="hover:opacity-70 transition-opacity z-20">
              <Shuffle
                className={cn(
                  'w-6 h-6',
                  isShuffled
                    ? 'text-blue-400 fill-blue-400'
                    : 'text-white fill-none'
                )}
              />
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className="text-sm font-semibold text-white/90">
              {likeCount} likes · {messageCount} questions
            </div>
          </div>
        </div>
      </div>

      <StoryChat
        topic={topic}
        currentSlideContent={getCurrentSlideContent()}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
};
