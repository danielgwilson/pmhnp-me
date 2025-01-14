import { FC } from 'react';
import { Quiz, QuizQuestion, QuizAnswer } from '@/types/quiz';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface QuizViewerProps {
  quiz: Quiz;
  currentQuestionIndex: number;
  selectedAnswer?: string;
  onSelectAnswer: (answerId: string) => void;
  onNextQuestion: () => void;
}

export const QuizViewer: FC<QuizViewerProps> = ({
  quiz,
  currentQuestionIndex,
  selectedAnswer,
  onSelectAnswer,
  onNextQuestion,
}) => {
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress bar */}
      <Progress value={progress} className="mb-8" />

      {/* Question */}
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">
          {currentQuestion.content.prompt.text}
        </h2>

        {/* Answers */}
        <div className="space-y-3">
          {currentQuestion.content.answers.map((answer: QuizAnswer) => (
            <Button
              key={answer.id}
              variant="outline"
              className={cn(
                'w-full justify-start text-left h-auto p-4',
                selectedAnswer === answer.id && 'ring-2 ring-primary',
                selectedAnswer && answer.isCorrect && 'bg-green-100',
                selectedAnswer &&
                  !answer.isCorrect &&
                  selectedAnswer === answer.id &&
                  'bg-red-100'
              )}
              onClick={() => !selectedAnswer && onSelectAnswer(answer.id)}>
              {answer.content.text}
            </Button>
          ))}
        </div>
      </Card>

      {/* Explanation (shown after answer selection) */}
      {selectedAnswer && currentQuestion.content.explanation && (
        <Card className="p-6 mb-6 bg-muted">
          <h3 className="font-semibold mb-2">Explanation</h3>
          <p>{currentQuestion.content.explanation.text}</p>
        </Card>
      )}

      {/* Next question button */}
      {selectedAnswer && (
        <Button className="w-full" onClick={onNextQuestion}>
          {currentQuestionIndex === quiz.questions.length - 1
            ? 'Finish Quiz'
            : 'Next Question'}
        </Button>
      )}
    </div>
  );
};
