
import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';

const OptionsSelector = () => {
  const { currentQuestion, userAnswers, handleOptionSelect } = useQuiz();

  if (!currentQuestion) return null;

  // Find current user answers
  const currentUserAnswer = userAnswers.find(
    answer => answer.questionId === currentQuestion.questionId
  );

  // Check if an option has been selected already
  const isOptionSelected = (option: string) => {
    return currentUserAnswer?.userSelections.includes(option) || false;
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      {currentQuestion.options.map((option, index) => (
        <Button
          key={index}
          variant={isOptionSelected(option) ? "secondary" : "outline"}
          className={`text-base py-6 h-auto ${
            isOptionSelected(option) 
              ? 'border-2 border-purple-500 opacity-70' 
              : 'hover:bg-purple-100'
          }`}
          onClick={() => {
            // Find the next available blank or the one this option is already in
            const existingIndex = currentUserAnswer?.userSelections.findIndex(
              sel => sel === option
            );
            
            if (existingIndex !== undefined && existingIndex !== -1) {
              // If this option is already selected, let's remove it
              handleOptionSelect(option, existingIndex);
            } else {
              // Find the first empty slot
              const emptyIndex = currentUserAnswer?.userSelections.findIndex(
                sel => sel === null
              );
              
              if (emptyIndex !== undefined && emptyIndex !== -1) {
                handleOptionSelect(option, emptyIndex);
              }
            }
          }}
          disabled={isOptionSelected(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default OptionsSelector;
