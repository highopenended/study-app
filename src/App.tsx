import { useState } from 'react';
import ChooseData from './pages/ChooseData';
import ExamPreface from './pages/ExamPreface';
import { Question } from './models/question';
import './App.css';

type AppView = 'choose-data' | 'exam-preface';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('choose-data');
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleQuestionsLoaded = (loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions);
    setCurrentView('exam-preface');
  };

  const handleStartExam = () => {
    // TODO: Navigate to QuestionView
    console.log('Start exam clicked');
  };

  const handleBack = () => {
    setCurrentView('choose-data');
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
    </>
  );
}

export default App;

