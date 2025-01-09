import { z } from 'zod';

export type StreakStatus = {
  currentStreak: number;
  lastStudyDate: string;
  dailyGoalMet: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
};

export type DailyProgress = {
  topicsStudied: number;
  questionsAsked: number;
  goalProgress: number;
};

const defaultDailyGoal = 3; // Number of topics to study per day

export function getStreakStatus(): StreakStatus {
  const stored = localStorage.getItem('streak');
  if (!stored) {
    return {
      currentStreak: 0,
      lastStudyDate: '',
      dailyGoalMet: false
    };
  }
  return JSON.parse(stored);
}

export function updateStreak(topicsStudied: number): StreakStatus {
  const current = getStreakStatus();
  const today = new Date().toISOString().split('T')[0];
  
  // Reset streak if a day was missed
  if (current.lastStudyDate && 
      new Date(current.lastStudyDate).toISOString().split('T')[0] !== 
      new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
    current.currentStreak = 0;
  }
  
  // Update streak if daily goal is met
  if (topicsStudied >= defaultDailyGoal && !current.dailyGoalMet) {
    current.currentStreak++;
    current.dailyGoalMet = true;
  }
  
  current.lastStudyDate = today;
  localStorage.setItem('streak', JSON.stringify(current));
  return current;
}

export function getDailyProgress(): DailyProgress {
  const stored = localStorage.getItem('dailyProgress');
  if (!stored) {
    return {
      topicsStudied: 0,
      questionsAsked: 0,
      goalProgress: 0
    };
  }
  return JSON.parse(stored);
}

export function updateDailyProgress(type: 'topic' | 'question'): DailyProgress {
  const progress = getDailyProgress();
  const today = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem('lastProgressDate');
  
  // Reset progress if it's a new day
  if (lastDate !== today) {
    progress.topicsStudied = 0;
    progress.questionsAsked = 0;
    progress.goalProgress = 0;
  }
  
  if (type === 'topic') {
    progress.topicsStudied++;
    progress.goalProgress = Math.min(100, (progress.topicsStudied / defaultDailyGoal) * 100);
  } else {
    progress.questionsAsked++;
  }
  
  localStorage.setItem('dailyProgress', JSON.stringify(progress));
  localStorage.setItem('lastProgressDate', today);
  return progress;
}

// Achievement definitions
export const achievements: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first topic',
    icon: '🎯'
  },
  {
    id: 'curious-mind',
    title: 'Curious Mind',
    description: 'Ask your first question',
    icon: '💭'
  },
  {
    id: 'steady-progress',
    title: 'Steady Progress',
    description: 'Complete 3 topics in one day',
    icon: '📚'
  },
  {
    id: 'achievement-hunter',
    title: '3-Day Streak',
    description: 'Study for 3 days in a row',
    icon: '🔥'
  }
];

export function checkAndUnlockAchievements(): Achievement[] {
  const streak = getStreakStatus();
  const progress = getDailyProgress();
  const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
  
  const newAchievements: Achievement[] = [];
  
  // Check each achievement condition
  achievements.forEach(achievement => {
    if (!unlockedAchievements.includes(achievement.id)) {
      let shouldUnlock = false;
      
      switch (achievement.id) {
        case 'first-step':
          shouldUnlock = progress.topicsStudied > 0;
          break;
        case 'curious-mind':
          shouldUnlock = progress.questionsAsked > 0;
          break;
        case 'steady-progress':
          shouldUnlock = progress.topicsStudied >= 3;
          break;
        case 'achievement-hunter':
          shouldUnlock = streak.currentStreak >= 3;
          break;
      }
      
      if (shouldUnlock) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
        unlockedAchievements.push(achievement.id);
      }
    }
  });
  
  localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
  return newAchievements;
}
