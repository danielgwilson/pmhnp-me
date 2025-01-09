import { Switch, Route } from "wouter";
import { Home } from "@/pages/Home";
import { Search } from "@/pages/Search";
import { Profile } from "@/pages/Profile";
import { Navigation } from "@/components/layout/Navigation";
import { TopicStory } from "@/components/TopicStory";
import { mockTopics } from "@/data/topics";
import { ToastManager } from "@/components/AchievementToast";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/search" component={Search} />
        <Route path="/profile" component={Profile} />
        <Route path="/story/:id">
          {(params) => {
            const topic = mockTopics.find((t) => t.id === params.id);
            return topic ? <TopicStory topic={topic} /> : null;
          }}
        </Route>
      </Switch>
      <Navigation />
      <ToastManager />
    </>
  );
}

export default App;