import { FC } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Achievement } from '@/lib/gamification';

interface AchievementToastProps {
  achievement: Achievement;
}

export const AchievementToast: FC<AchievementToastProps> = ({ achievement }) => {
  const { toast } = useToast();
  
  return (
    <div className="flex items-start gap-2">
      <div className="text-2xl">{achievement.icon}</div>
      <div>
        <h3 className="font-semibold">{achievement.title}</h3>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
      </div>
    </div>
  );
};

export const showAchievementToast = (achievement: Achievement) => {
  const { toast } = useToast();
  
  toast({
    title: "Achievement Unlocked!",
    description: (
      <AchievementToast achievement={achievement} />
    ),
    duration: 5000,
  });
};
