
import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { Clock } from 'lucide-react';

const Timer = () => {
  const { timeRemaining } = useQuiz();

  return (
    <div className="mb-6 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="text-purple-500" size={18} />
          <span className="font-medium text-sm">Time Remaining</span>
        </div>
        <span className={`font-bold text-lg ${timeRemaining <= 10 ? 'text-red-500' : ''}`}>
          {timeRemaining}s
        </span>
      </div>
    </div>
  );
};

export default Timer;
