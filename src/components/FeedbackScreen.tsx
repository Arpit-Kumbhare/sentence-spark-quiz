
import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const FeedbackScreen = () => {
  const { questions, userAnswers, score, resetQuiz } = useQuiz();
  const totalQuestions = questions.length;
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
        <div className="text-lg">
          Your score: <span className="font-bold text-2xl text-purple-600">{score}</span> out of {totalQuestions}
        </div>
        
        <div className="mt-4 bg-gray-100 p-4 rounded-lg inline-block">
          <div className="text-sm text-gray-600">Score percentage</div>
          <div className="text-2xl font-bold">{Math.round((score / totalQuestions) * 100)}%</div>
        </div>
      </div>
      
      <div className="space-y-6 mb-8">
        {questions.map((question, index) => {
          const userAnswer = userAnswers.find(answer => answer.questionId === question.questionId);
          const isCorrect = userAnswer?.isCorrect;

          return (
            <Card key={question.questionId} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <div className={`p-1 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isCorrect ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />}
                </div>
                <div>
                  <CardTitle className="text-base font-medium">Question {index + 1}</CardTitle>
                  <CardDescription className="text-xs">
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="text-sm mb-4">
                  {question.question.split('_____________').map((part, partIndex) => (
                    <React.Fragment key={partIndex}>
                      {part}
                      {partIndex < question.correctAnswer.length && (
                        <span className={`px-2 py-0.5 rounded mx-1 font-medium ${
                          userAnswer?.userSelections[partIndex] === question.correctAnswer[partIndex]
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userAnswer?.userSelections[partIndex] || '(blank)'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                {!isCorrect && (
                  <div className="mt-3 pt-3 border-t text-sm">
                    <div className="font-medium text-xs text-gray-500 mb-1">Correct answer:</div>
                    {question.question.split('_____________').map((part, partIndex) => (
                      <React.Fragment key={partIndex}>
                        {part}
                        {partIndex < question.correctAnswer.length && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded mx-1 font-medium">
                            {question.correctAnswer[partIndex]}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center">
        <Button onClick={resetQuiz} size="lg">
          Take Quiz Again
        </Button>
      </div>
    </div>
  );
};

export default FeedbackScreen;
