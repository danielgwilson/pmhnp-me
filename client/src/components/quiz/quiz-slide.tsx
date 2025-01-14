import { motion } from 'framer-motion';
import type { QuizQuestion } from '../../types/quiz';
import { QuizChoice } from './quiz-choice';

interface QuizSlideProps {
  question: QuizQuestion;
  selectedAnswerId?: string;
  isRevealed: boolean;
  onSelectAnswer: (answerId: string) => void;
  slideType: 'prompt' | 'choices' | 'explanation';
}

export const QuizSlide = ({
  question,
  selectedAnswerId,
  isRevealed,
  onSelectAnswer,
  slideType,
}: QuizSlideProps) => {
  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const renderContent = () => {
    switch (slideType) {
      case 'prompt':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">
              Question {question.questionNumber}
            </h2>
            <div
              className="text-xl leading-relaxed"
              dangerouslySetInnerHTML={{ __html: question.content.prompt.html }}
            />
          </div>
        );
      case 'choices':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-6">Select your answer:</h3>
            {question.content.answers.map((answer) => (
              <QuizChoice
                key={answer.id}
                answer={answer}
                isSelected={selectedAnswerId === answer.id}
                isRevealed={isRevealed}
                onSelect={onSelectAnswer}
                disabled={isRevealed}
              />
            ))}
          </div>
        );
      case 'explanation':
        const correctAnswer = question.content.answers.find((a) => a.isCorrect);
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Explanation</h3>
              <div className="p-4 rounded-lg bg-primary/5 border">
                <h4 className="text-lg font-medium mb-2">Correct Answer:</h4>
                <p
                  className="text-lg"
                  dangerouslySetInnerHTML={{
                    __html: correctAnswer?.content.html ?? '',
                  }}
                />
              </div>
            </div>
            {question.content.explanation ? (
              <div
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: question.content.explanation.html,
                }}
              />
            ) : (
              <p className="text-lg italic text-muted-foreground">
                No explanation provided for this question.
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <motion.div
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full w-full flex items-center justify-center p-8">
      <div className="max-w-3xl w-full mx-auto">{renderContent()}</div>
    </motion.div>
  );
};
