export type QuizAnswer = {
  id: string;
  answer_id: number;
  choice: string;
  content: {
    text: string;
    html: string;
  };
  isCorrect: boolean;
};

export type QuizSection = {
  id: string;
  level: number;
  number: number;
  order: number;
  parent_id: string | null;
  title: string;
};

export type QuizQuestion = {
  id: string;
  cw_id: string;
  questionNumber: string;
  sections: QuizSection[];
  content: {
    prompt: {
      text: string;
      html: string;
    };
    answers: QuizAnswer[];
    explanation?: {
      text: string;
      html: string;
    };
  };
};

export type QuizProgress = {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
};

export type Quiz = {
  id: string;
  title: string;
  questions: QuizQuestion[];
};
