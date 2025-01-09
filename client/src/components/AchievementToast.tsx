import { FC } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Achievement } from '@/lib/gamification';

interface AchievementToastProps {
  achievement: Achievement;
}

export const AchievementToast: FC<AchievementToastProps> = ({ achievement }) => {
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

// Create a toast manager that doesn't use hooks directly
let toastFn: ((props: { title: string; description: React.ReactNode; duration?: number }) => void) | null = null;

export const ToastManager: FC = () => {
  const { toast } = useToast();
  toastFn = toast;
  return null;
};

export const showAchievementToast = (achievement: Achievement) => {
  if (toastFn) {
    toastFn({
      title: "Achievement Unlocked!",
      description: <AchievementToast achievement={achievement} />,
      duration: 5000,
    });
  }
};