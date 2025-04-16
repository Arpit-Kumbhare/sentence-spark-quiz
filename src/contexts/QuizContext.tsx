import React, { createContext, useContext, useState, useEffect } from 'react';
import { Question, QuizData, UserAnswer } from '../types';
import { fetchQuizData } from '../services/api';
import { toast } from '@/components/ui/use-toast';

interface QuizContextType {
  loading: boolean;
  currentQuestionIndex: number;
  questions: Question[];
  currentQuestion: Question | null;
  userAnswers: UserAnswer[];
  timeRemaining: number;
  isQuizCompleted: boolean;
  handleOptionSelect: (option: string, blankIndex: number) => void;
  handleNextQuestion: () => void;
  resetQuiz: () => void;
  score: number;
  areAllBlanksFilledInCurrentQuestion: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Current question
  const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length
    ? questions[currentQuestionIndex]
    : null;

  // Load quiz data
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const data = await fetchQuizData();
        setQuestions(data.data.questions);
        
        // Initialize user answers
        const initialUserAnswers = data.data.questions.map(question => ({
          questionId: question.questionId,
          userSelections: Array(question.correctAnswer.length).fill(null)
        }));
        setUserAnswers(initialUserAnswers);
        
        setLoading(false);
        setTimerActive(true);
      } catch (error) {
        console.error('Failed to fetch quiz data:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    loadQuizData();
  }, []);

  // Timer logic
  useEffect(() => {
    if (timerActive && !isQuizCompleted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isQuizCompleted) {
      handleNextQuestion();
    }
  }, [timeRemaining, timerActive, isQuizCompleted]);

  // Reset timer when moving to a new question
  useEffect(() => {
    setTimeRemaining(30);
  }, [currentQuestionIndex]);

  const handleOptionSelect = (option: string, blankIndex: number) => {
    if (!currentQuestion) return;

    const updatedUserAnswers = [...userAnswers];
    const currentAnswer = updatedUserAnswers.find(
      answer => answer.questionId === currentQuestion.questionId
    );

    if (currentAnswer) {
      const newSelections = [...currentAnswer.userSelections];
      
      // If the same option is already selected at this position, deselect it
      if (newSelections[blankIndex] === option) {
        newSelections[blankIndex] = null;
      } else {
        // Otherwise, select this option and remove it from any other position
        const existingIndex = newSelections.findIndex(sel => sel === option);
        if (existingIndex !== -1) {
          newSelections[existingIndex] = null;
        }
        newSelections[blankIndex] = option;
      }
      
      currentAnswer.userSelections = newSelections;
      setUserAnswers(updatedUserAnswers);
    }
  };

  const areAllBlanksFilledInCurrentQuestion = userAnswers.find(
    answer => currentQuestion && answer.questionId === currentQuestion.questionId
  )?.userSelections.every(selection => selection !== null) ?? false;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score and mark correct/incorrect answers
      const evaluatedAnswers = userAnswers.map(userAnswer => {
        const question = questions.find(q => q.questionId === userAnswer.questionId);
        const isCorrect = question && 
          JSON.stringify(userAnswer.userSelections) === 
          JSON.stringify(question.correctAnswer);
        
        return {
          ...userAnswer,
          isCorrect: !!isCorrect
        };
      });

      setUserAnswers(evaluatedAnswers);
      setIsQuizCompleted(true);
      setTimerActive(false);
    }
  };

  const score = userAnswers.filter(answer => answer.isCorrect).length;

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setTimeRemaining(30);
    setIsQuizCompleted(false);
    
    // Reset user answers
    const initialUserAnswers = questions.map(question => ({
      questionId: question.questionId,
      userSelections: Array(question.correctAnswer.length).fill(null)
    }));
    setUserAnswers(initialUserAnswers);
    
    setTimerActive(true);
  };

  const value = {
    loading,
    currentQuestionIndex,
    questions,
    currentQuestion,
    userAnswers,
    timeRemaining,
    isQuizCompleted,
    handleOptionSelect,
    handleNextQuestion,
    resetQuiz,
    score,
    areAllBlanksFilledInCurrentQuestion
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
