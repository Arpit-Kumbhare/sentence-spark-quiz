
import React from 'react';
import { QuizProvider } from '@/contexts/QuizContext';
import QuizScreen from '@/components/QuizScreen';

const Quiz = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Sentence Construction Quiz</h1>
          <p className="text-gray-600">
            Fill in the blanks with the correct words to complete each sentence.
          </p>
        </header>

        <QuizProvider>
          <QuizScreen />
        </QuizProvider>
      </div>
    </div>
  );
};

export default Quiz;
