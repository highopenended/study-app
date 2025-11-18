import { useState } from 'react';
import ChooseData from './pages/ChooseData';
import ExamPreface from './pages/ExamPreface';
import QuestionView from './pages/QuestionView';
import { Question } from './models/question';
import './App.css';

type AppView = 'choose-data' | 'exam-preface' | 'question-view';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('choose-data');
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleQuestionsLoaded = (loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions);
    setCurrentView('exam-preface');
  };

  const handleStartExam = () => {
    setCurrentView('question-view');
  };

  const handleBack = () => {
    setCurrentView('choose-data');
  };

  const handleExamComplete = () => {
    // TODO: Navigate to ExamSummary
    console.log('Exam completed');
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
    </>
  );
}

export default App;

