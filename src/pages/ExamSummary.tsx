/**
 * ExamSummary page component
 * Post-exam view displaying score, category breakdown, and all questions with correct answers highlighted
 */
import { useMemo } from 'react';
import { Question } from '../models/question';

interface ExamSummaryProps {
  questions: Question[];
  selectedAnswers: Record<number, number>;
  onRestart: () => void;
}

interface ScoreResult {
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
  passed: boolean;
}

/**
 * Calculate overall exam score
 */
function calculateScore(questions: Question[], selectedAnswers: Record<number, number>): ScoreResult {
  let correct = 0;
  let incorrect = 0;
  const total = questions.length;

  questions.forEach((question, index) => {
    const selectedAnswer = selectedAnswers[index];
    if (selectedAnswer !== undefined && question.correctAnswer !== null) {
      if (question.isCorrect(selectedAnswer)) {
        correct++;
      } else {
        incorrect++;
      }
    } else {
      // Unanswered questions count as incorrect
      incorrect++;
    }
  });

  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = percentage >= 80;

  return { correct, incorrect, total, percentage, passed };
}

export default function ExamSummary({ questions, selectedAnswers, onRestart }: ExamSummaryProps) {
  const score = useMemo(() => calculateScore(questions, selectedAnswers), [questions, selectedAnswers]);

  return (
    <div className="page-container">
      <div className="card">
        {/* Score Display Section */}
        <div className="score-display">
          <h1 className={`score-percentage ${score.passed ? 'score-passed' : 'score-failed'}`}>
            Your score: {score.percentage}%
          </h1>
          
          <div className={`pass-indicator ${score.passed ? 'pass-indicator-passed' : 'pass-indicator-failed'}`}>
            {score.passed ? 'You have passed the exam.' : 'You have not passed the exam.'}
          </div>
          
          <div className="passing-score">
            Passing score: 80%
          </div>

          <div className="score-breakdown">
            <div className="score-item score-correct">
              <span className="score-icon">✓</span>
              <span>Correct: {score.correct}/{score.total}</span>
            </div>
            <div className="score-item score-incorrect">
              <span className="score-icon">✗</span>
              <span>Incorrect: {score.incorrect}/{score.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button onClick={onRestart} className="btn-primary">
          Return To Course Home
        </button>
      </div>
    </div>
  );
}

