import { FC } from 'react';
import { cn } from '@/lib/utils';

interface ImageFallbackProps {
  title: string;
  className?: string;
}

export const ImageFallback: FC<ImageFallbackProps> = ({ title, className }) => {
  const initials = title
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div 
      className={cn(
        "w-full h-full flex items-center justify-center bg-muted",
        className
      )}
    >
      <span className="text-2xl font-semibold text-muted-foreground">
        {initials}
      </span>
    </div>
  );
};
