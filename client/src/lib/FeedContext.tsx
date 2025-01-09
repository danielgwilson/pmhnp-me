import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  const [state] = useState(() => ({
    feedTopics: [...mockTopics].sort(() => Math.random() - 0.5),
    topicCircles: [...mockTopics].sort(() => Math.random() - 0.5).slice(0, 10),
    recommendedTopics: [...mockTopics].sort(() => Math.random() - 0.5).slice(0, 5),
  }));

  return (
    <FeedContext.Provider value={state}>
      {children}
    </FeedContext.Provider>
  );
}
