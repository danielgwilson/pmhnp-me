import { FC } from 'react';
import { cn } from '@/lib/utils';

interface ImageFallbackProps {
  title: string;
  imageUrl?: string;
  className?: string;
}

export const ImageFallback: FC<ImageFallbackProps> = ({ title, imageUrl, className }) => {
  const initials = title
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (!imageUrl) {
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
  }

  return (
    <div className={cn("w-full h-full relative", className)}>
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
        }}
      />
      <div className="fallback hidden absolute inset-0 flex items-center justify-center bg-muted">
        <span className="text-2xl font-semibold text-muted-foreground">
          {initials}
        </span>
      </div>
    </div>
  );
};