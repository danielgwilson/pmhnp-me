import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { loadQuiz } from '@/lib/quiz-loader';
import { QuizViewer } from '@/components/quiz/quiz-viewer';
import type { Quiz } from '@/types/quiz';

export const QuizPage = () => {
  const {
    data: quiz,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['quiz', 'pmhnp-bc'],
    queryFn: () => loadQuiz('pmhnp-bc'),
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading quiz</div>;
  if (!quiz) return null;

  return (
    <QuizViewer
      quiz={quiz}
      currentQuestionIndex={currentQuestionIndex}
      selectedAnswer={selectedAnswer}
      onSelectAnswer={setSelectedAnswer}
      onNextQuestion={() => {
        setSelectedAnswer(undefined);
        setCurrentQuestionIndex((prev) =>
          prev < quiz.questions.length - 1 ? prev + 1 : prev
        );
      }}
    />
  );
};
