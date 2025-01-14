import type { Quiz, QuizQuestion } from '../types/quiz';
import pmhnpBcQuiz from '../data/quizzes/pmhnp-bc.json';

const transformQuizData = (data: QuizQuestion[]): Quiz => {
  return {
    id: 'pmhnp-bc',
    title: 'PMHNP-BC 🔥',
    questions: data.map((question) => ({
      ...question,
      content: {
        ...question.content,
        answers: question.content.answers.sort((a, b) =>
          a.choice.localeCompare(b.choice)
        ),
      },
    })),
  };
};

export const loadQuiz = async (quizId: string): Promise<Quiz> => {
  // In the future, this could load different quizzes based on the ID
  // For now, we only have one quiz
  if (quizId === 'pmhnp-bc') {
    return transformQuizData(pmhnpBcQuiz as QuizQuestion[]);
  }
  throw new Error(`Quiz not found: ${quizId}`);
};
