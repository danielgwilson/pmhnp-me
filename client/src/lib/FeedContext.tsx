import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { mockTopics, type Topic } from '@/data/topics';

interface FeedContextType {
  feedTopics: Topic[];
  topicCircles: Topic[];
  recommendedTopics: Topic[];
}

const FeedContext = createContext<FeedContextType | null>(null);

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}

export function FeedProvider({ children }: { children: ReactNode }) {
  // Initialize state only once when the provider mounts
  const [state] = useState(() => {
    // Separate quiz and regular topics
    const quizTopics = mockTopics.filter((t) => t.type === 'quiz');
    const regularTopics = mockTopics.filter((t) => t.type === 'slides');

    // Shuffle regular topics
    const shuffledRegular = [...regularTopics].sort(() => Math.random() - 0.5);

    return {
      // Quiz first, then shuffled regular topics
      feedTopics: [...quizTopics, ...shuffledRegular],
      // Quiz first in circles, then some shuffled regular topics
      topicCircles: [...quizTopics, ...shuffledRegular.slice(0, 9)],
      // Random selection for recommended
      recommendedTopics: [...shuffledRegular].slice(0, 5),
    };
  });

  return <FeedContext.Provider value={state}>{children}</FeedContext.Provider>;
}
