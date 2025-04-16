
import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const QuizNavigation = () => {
  const { 
    currentQuestionIndex, 
    handleNextQuestion, 
    questions,
    areAllBlanksFilledInCurrentQuestion
  } = useQuiz();

  return (
    <div className="flex justify-between items-center">
      <div className="text-sm font-medium">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>
      <Button 
        onClick={handleNextQuestion}
        disabled={!areAllBlanksFilledInCurrentQuestion}
        className="px-6"
      >
        Next <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuizNavigation;
