import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { loadQuiz } from '../lib/quiz-loader';
import { QuizViewer } from '../components/quiz/quiz-viewer';
import type { Quiz } from '../types/quiz';

export const QuizPage = () => {
  const {
    data: quiz,
    isLoading,
    error,
  } = useQuery<Quiz>({
    queryKey: ['quiz', 'pmhnp-bc'],
    queryFn: () => loadQuiz('pmhnp-bc'),
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-red-500">
            Error Loading Quiz
          </h2>
          <p className="text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="h-screen bg-background">
      <QuizViewer quiz={quiz} />
    </div>
  );
};
