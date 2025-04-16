
import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { Card, CardContent } from '@/components/ui/card';

const QuestionDisplay = () => {
  const { currentQuestion, userAnswers, handleOptionSelect } = useQuiz();

  if (!currentQuestion) return null;

  // Find the current user's answers for this question
  const currentUserAnswer = userAnswers.find(
    answer => answer.questionId === currentQuestion.questionId
  );

  // Split the question into segments based on blanks
  const questionParts = currentQuestion.question.split('_____________');

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="text-lg leading-relaxed">
          {questionParts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              
              {/* Don't render a blank after the last part */}
              {index < questionParts.length - 1 && (
                <span 
                  className={`inline-block px-4 py-1 mx-1 rounded-md border-2 min-w-24 text-center
                    ${currentUserAnswer?.userSelections[index] 
                      ? 'bg-purple-100 border-purple-500 cursor-pointer hover:bg-purple-200' 
                      : 'border-dashed border-gray-400'}`}
                  onClick={() => {
                    if (currentUserAnswer?.userSelections[index]) {
                      handleOptionSelect(currentUserAnswer.userSelections[index] as string, index);
                    }
                  }}
                >
                  {currentUserAnswer?.userSelections[index] || ''}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;
