/**
 * QuestionView page component
 * Test-taking view displaying one question at a time with navigation controls
 */
import { useState } from 'react';
import { Question } from '../models/question';

interface QuestionViewProps {
  questions: Question[];
  onComplete: (selectedAnswers: Record<number, number>) => void;
}

export default function QuestionView({ questions, onComplete }: QuestionViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [starredQuestions, setStarredQuestions] = useState<Set<number>>(new Set());
  const [pulsingQuestion, setPulsingQuestion] = useState<number | null>(null);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];
  const isStarred = starredQuestions.has(currentIndex);
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (answerNumber: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: answerNumber,
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1 && selectedAnswer) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinishExam = () => {
    onComplete(selectedAnswers);
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleStarToggle = () => {
    const newStarred = new Set(starredQuestions);
    if (isStarred) {
      newStarred.delete(currentIndex);
    } else {
      newStarred.add(currentIndex);
    }
    setStarredQuestions(newStarred);
  };

  const handleJumpToQuestion = (questionIndex: number) => {
    setPulsingQuestion(questionIndex);
    setTimeout(() => setPulsingQuestion(null), 600);
    setCurrentIndex(questionIndex);
  };

  const starredList = Array.from(starredQuestions).sort((a, b) => a - b);

  return (
    <div className="question-view-container">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-text">
          {currentIndex + 1} of {totalQuestions}
        </div>
      </div>

      <div className="question-view-content">
        {/* Main Question Area */}
        <div className="question-main">
          <div className="card question-card">
            <div className="question-header">
              <div className="question-text">{currentQuestion.question}</div>
              <button
                onClick={handleStarToggle}
                className={`star-button ${isStarred ? 'starred' : ''}`}
                aria-label={isStarred ? 'Unstar question' : 'Star question'}
              >
                {isStarred ? '★' : '☆'}
              </button>
            </div>

            <div className="answer-options">
              {[1, 2, 3, 4].map((optionNum) => {
                const optionText = currentQuestion.getOption(optionNum);
                const isSelected = selectedAnswer === optionNum;
                return (
                  <button
                    key={optionNum}
                    onClick={() => handleAnswerSelect(optionNum)}
                    className={`answer-option ${isSelected ? 'answer-selected' : ''}`}
                  >
                    {optionText}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="question-navigation">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="btn-secondary"
            >
              Previous
            </button>
            {isLastQuestion ? (
              <button
                onClick={handleFinishExam}
                disabled={!selectedAnswer}
                className="btn-primary"
              >
                Finish Exam
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="question-sidebar">
          <div className="card sidebar-card">
            <div className="sidebar-section">
              <div className="sidebar-title">Jump To</div>
              <div className="sidebar-content">
                <div className="sidebar-text">Jump to starred questions</div>
              </div>
              {starredList.length > 0 && (
                <div className="starred-list">
                  {starredList.map((qIndex) => (
                    <button
                      key={qIndex}
                      onClick={() => handleJumpToQuestion(qIndex)}
                      className={`starred-question-link ${pulsingQuestion === qIndex ? 'pulse' : ''}`}
                    >
                      {qIndex + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
