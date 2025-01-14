import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { QuizAnswer } from '../../types/quiz';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizChoiceProps {
  answer: QuizAnswer;
  isSelected: boolean;
  isRevealed: boolean;
  onSelect: (answerId: string) => void;
  disabled?: boolean;
}

export const QuizChoice = ({
  answer,
  isSelected,
  isRevealed,
  onSelect,
  disabled,
}: QuizChoiceProps) => {
  const getStateStyles = () => {
    if (!isRevealed) {
      return isSelected
        ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary'
        : 'hover:bg-muted/80 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]';
    }
    if (answer.isCorrect) {
      return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500 ring-2 ring-green-500 shadow-lg shadow-green-500/20';
    }
    if (isSelected && !answer.isCorrect) {
      return 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500 ring-2 ring-red-500 shadow-lg shadow-red-500/20';
    }
    return 'opacity-40';
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onSelect(answer.id);
      }}
      className={cn(
        'w-full p-6 rounded-xl border transition-all duration-300',
        'flex items-center justify-between gap-4',
        'focus:outline-none select-none',
        getStateStyles(),
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
      disabled={disabled}>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full border text-lg font-medium">
          {answer.choice}
        </div>
        <span
          className="text-lg"
          dangerouslySetInnerHTML={{ __html: answer.content.html }}
        />
      </div>
      {isRevealed && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
            answer.isCorrect
              ? 'bg-green-500 text-white'
              : isSelected
              ? 'bg-red-500 text-white'
              : 'bg-transparent'
          )}>
          {answer.isCorrect ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            isSelected && <XCircle className="w-6 h-6" />
          )}
        </motion.div>
      )}
    </motion.button>
  );
};
