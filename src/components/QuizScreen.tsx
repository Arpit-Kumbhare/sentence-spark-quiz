
import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import Timer from './Timer';
import QuestionDisplay from './QuestionDisplay';
import OptionsSelector from './OptionsSelector';
import QuizNavigation from './QuizNavigation';
import FeedbackScreen from './FeedbackScreen';
import { Card, CardContent } from '@/components/ui/card';

const QuizScreen = () => {
  const { loading, isQuizCompleted } = useQuiz();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (isQuizCompleted) {
    return <FeedbackScreen />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Timer />
      
      <QuestionDisplay />
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Select words to fill the blanks:</h3>
          <OptionsSelector />
        </CardContent>
      </Card>
      
      <QuizNavigation />
    </div>
  );
};

export default QuizScreen;
