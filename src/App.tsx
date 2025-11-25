import { useState } from 'react';
import ChooseData from './pages/ChooseData';
import ExamPreface from './pages/ExamPreface';
import QuestionView from './pages/QuestionView';
import ExamSummary from './pages/ExamSummary';
import { Question } from './models/question';
import './App.css';

type AppView = 'choose-data' | 'exam-preface' | 'question-view' | 'exam-summary';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('choose-data');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const handleQuestionsLoaded = (loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions);
    setCurrentView('exam-preface');
  };

  const handleStartExam = () => {
    setCurrentView('question-view');
    setSelectedAnswers({}); // Reset answers when starting new exam
  };

  const handleBack = () => {
    setCurrentView('choose-data');
  };

  const handleExamComplete = (answers: Record<number, number>) => {
    setSelectedAnswers(answers);
    setCurrentView('exam-summary');
  };

  const handleRestart = () => {
    setCurrentView('choose-data');
    setSelectedAnswers({});
  };

  return (
    <>
      {currentView === 'choose-data' && (
        <ChooseData onQuestionsLoaded={handleQuestionsLoaded} />
      )}
      {currentView === 'exam-preface' && (
        <ExamPreface 
          questions={questions} 
          onStartExam={handleStartExam}
          onBack={handleBack}
        />
      )}
      {currentView === 'question-view' && (
        <QuestionView 
          questions={questions}
          onComplete={handleExamComplete}
        />
      )}
      {currentView === 'exam-summary' && (
        <ExamSummary 
          questions={questions}
          selectedAnswers={selectedAnswers}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}

export default App;

