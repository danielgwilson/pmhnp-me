import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Topic } from '@/data/topics';
import { StoryProgress } from './StoryProgress';
import { StoryChat } from './StoryChat';
import { Button } from './ui/button';
import { X, Heart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { loadQuiz } from '@/lib/quiz-loader';
import { QuizChoice } from './quiz/quiz-choice';
import { cn } from '@/lib/utils';
import { getLikes, toggleLike, getMessageCount } from '@/lib/storage';
import { useQuizProgress } from '@/hooks/use-quiz-progress';

interface TopicStoryProps {
  topic: Topic;
  onClose: () => void;
}

export const TopicStory = ({ topic, onClose }: TopicStoryProps) => {
  const [_, setLocation] = useLocation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [likeCount, setLikeCount] = useState(getLikes(topic.id));
  const [messageCount, setMessageCount] = useState(getMessageCount(topic.id));
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [direction, setDirection] = useState<'left' | 'right'>('left');

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
      setDirection('right');
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

  const handleNextSlide = () => {
    setDirection('left');
    if (topic.type === 'slides' && topic.slides) {
      if (currentSlideIndex < topic.slides.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }
    } else if (topic.type === 'quiz' && quiz.data) {
      const currentQuestion =
        quiz.data.questions[Math.floor(currentSlideIndex / 3)];
      const slideType = currentSlideIndex % 3;
      const hasAnswer = selectedAnswers[currentQuestion.id];

      if (
        slideType === 0 || // Prompt -> Choices
        (slideType === 1 && hasAnswer) || // Choices -> Explanation (if answered)
        (slideType === 2 &&
          Math.floor(currentSlideIndex / 3) < quiz.data.questions.length - 1) // Explanation -> Next Question
      ) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }
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
      setDirection('left');
      const currentQuestionIndex = Math.floor(currentSlideIndex / 3);
      const nextSlideIndex = currentQuestionIndex * 3 + 2;
      setCurrentSlideIndex(nextSlideIndex);
    }, 1500);
  };

  const renderContent = () => {
    if (topic.type === 'slides' && topic.slides) {
      const slide = topic.slides[currentSlideIndex];
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
      const questionIndex = Math.floor(currentSlideIndex / 3);
      const slideType = currentSlideIndex % 3;
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

  const getTotalSlides = () => {
    if (topic.type === 'slides' && topic.slides) {
      return topic.slides.length;
    }
    if (topic.type === 'quiz' && quiz.data) {
      return quiz.data.questions.length * 3;
    }
    return 0;
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
            current={currentSlideIndex + 1}
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
              onClick={handleNextSlide}
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto px-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlideIndex}
                  initial={{
                    opacity: 0,
                    x: direction === 'left' ? 100 : -100,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: direction === 'left' ? -100 : 100,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                  }}
                  className="z-20 relative">
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
          </div>

          <div className="px-4 pb-4">
            <div className="text-sm font-semibold text-white/90">
              {likeCount} likes · {messageCount} questions
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showChat && (
          <StoryChat
            topicId={topic.id}
            isOpen={showChat}
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
