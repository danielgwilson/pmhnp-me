import { Switch, Route, useLocation } from 'wouter';
import { Home } from '@/pages/Home';
import { Search } from '@/pages/Search';
import { Profile } from '@/pages/Profile';
import { Navigation } from '@/components/layout/Navigation';
import { TopicStory } from '@/components/TopicStory';
import { mockTopics } from '@/data/topics';
import { ToastManager } from '@/components/AchievementToast';
import { AnimatePresence } from 'framer-motion';
import { FeedProvider } from '@/lib/FeedContext';
import { useState } from 'react';

function App() {
  const [activeStory, setActiveStory] = useState<string | null>(null);

  return (
    <FeedProvider>
      <>
        <Switch>
          <Route path="/">
            <Home setActiveStory={setActiveStory} />
          </Route>
          <Route path="/search" component={Search} />
          <Route path="/profile" component={Profile} />
        </Switch>
        <Navigation />
        <ToastManager />

        <AnimatePresence>
          {activeStory && (
            <TopicStory
              topic={mockTopics.find((t) => t.id === activeStory)!}
              onClose={() => setActiveStory(null)}
            />
          )}
        </AnimatePresence>
      </>
    </FeedProvider>
  );
}

export default App;
