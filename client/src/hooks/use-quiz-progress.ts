import { useCallback, useEffect, useState } from 'react';
import type { QuizProgress } from '../types/quiz';

const STORAGE_KEY = 'quiz-progress';

export const useQuizProgress = (quizId: string) => {
  const [progress, setProgress] = useState<QuizProgress[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${quizId}`);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored quiz progress:', error);
      }
    }
  }, [quizId]);

  const saveAnswer = useCallback(
    (questionId: string, answerId: string, isCorrect: boolean) => {
      setProgress((prev) => {
        const newProgress = [
          ...prev.filter((p) => p.questionId !== questionId),
          { questionId, selectedAnswerId: answerId, isCorrect },
        ];
        localStorage.setItem(
          `${STORAGE_KEY}-${quizId}`,
          JSON.stringify(newProgress)
        );
        return newProgress;
      });
    },
    [quizId]
  );

  const getQuestionProgress = useCallback(
    (questionId: string) => {
      return progress.find((p) => p.questionId === questionId);
    },
    [progress]
  );

  const resetProgress = useCallback(() => {
    localStorage.removeItem(`${STORAGE_KEY}-${quizId}`);
    setProgress([]);
  }, [quizId]);

  return {
    progress,
    saveAnswer,
    getQuestionProgress,
    resetProgress,
  };
};
