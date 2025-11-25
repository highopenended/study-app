/**
 * ExamSummary page component
 * Post-exam view displaying score, category breakdown, and all questions with correct answers highlighted
 */
import { useMemo, useState } from 'react';
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

interface CategoryScore {
  topic: string;
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
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

/**
 * Calculate scores grouped by topic/category
 */
function calculateCategoryScores(questions: Question[], selectedAnswers: Record<number, number>): CategoryScore[] {
  const categoryMap: Record<string, { correct: number; incorrect: number; total: number }> = {};

  questions.forEach((question, index) => {
    const topic = question.topic || 'Uncategorized';
    const selectedAnswer = selectedAnswers[index];

    if (!categoryMap[topic]) {
      categoryMap[topic] = { correct: 0, incorrect: 0, total: 0 };
    }

    categoryMap[topic].total++;

    if (selectedAnswer !== undefined && question.correctAnswer !== null) {
      if (question.isCorrect(selectedAnswer)) {
        categoryMap[topic].correct++;
      } else {
        categoryMap[topic].incorrect++;
      }
    } else {
      // Unanswered questions count as incorrect
      categoryMap[topic].incorrect++;
    }
  });

  return Object.entries(categoryMap)
    .map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      incorrect: stats.incorrect,
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }))
    .sort((a, b) => a.topic.localeCompare(b.topic));
}

export default function ExamSummary({ questions, selectedAnswers, onRestart }: ExamSummaryProps) {
  const [isCategoryBreakdownOpen, setIsCategoryBreakdownOpen] = useState(true);
  const score = useMemo(() => calculateScore(questions, selectedAnswers), [questions, selectedAnswers]);
  const categoryScores = useMemo(() => calculateCategoryScores(questions, selectedAnswers), [questions, selectedAnswers]);

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
          
          <div className="card-text">
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

      {/* Category Breakdown Section */}
      <div className="card">
        <button
          onClick={() => setIsCategoryBreakdownOpen(!isCategoryBreakdownOpen)}
          className="category-breakdown-header"
          aria-expanded={isCategoryBreakdownOpen}
        >
          <span>SCORING BREAKDOWN</span>
          <span className="category-breakdown-arrow">
            {isCategoryBreakdownOpen ? '▲' : '▼'}
          </span>
        </button>

        {isCategoryBreakdownOpen && (
          <div className="category-breakdown-content">
            {categoryScores.map((category) => (
              <div key={category.topic} className="category-item">
                <div className="category-bar" />
                <div className="category-info">
                  <div className="category-name">{category.topic}</div>
                </div>
                <div className="category-stats">
                  <div className="category-stat score-correct">
                    <span className="score-icon">✓</span>
                    <span>Correct: {category.correct}</span>
                  </div>
                  <div className="category-stat score-incorrect">
                    <span className="score-icon">✗</span>
                    <span>Incorrect: {category.incorrect}</span>
                  </div>
                  <div className={`category-percentage ${category.percentage >= 80 ? 'category-percentage-passed' : 'category-percentage-failed'}`}>
                    {category.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Question List Section */}
      <div className="card question-list-card">
        <h2 className="question-list-title">Question Review</h2>
        <div className="question-list">
          {questions.map((question, index) => {
            const selectedAnswer = selectedAnswers[index];
            const isCorrect = selectedAnswer !== undefined && question.correctAnswer !== null && question.isCorrect(selectedAnswer);
            const correctAnswerNum = question.correctAnswer;

            return (
              <div key={index} className="summary-question">
                <div className="summary-question-header">
                  Question {index + 1}
                </div>
                
                <div className="summary-question-text">
                  {question.question}
                </div>

                {(question.topic || question.subtopic) && (
                  <div className="summary-question-meta">
                    {question.topic && (
                      <span className="summary-topic">Topic: {question.topic}</span>
                    )}
                    {question.subtopic && (
                      <span className="summary-subtopic">Subtopic: {question.subtopic}</span>
                    )}
                  </div>
                )}

                <div className="summary-answer-options">
                  {[1, 2, 3, 4].map((optionNum) => {
                    const optionText = question.getOption(optionNum);
                    const isCorrectAnswer = correctAnswerNum === optionNum;
                    const isUserAnswer = selectedAnswer === optionNum;
                    const isUserWrongAnswer = isUserAnswer && !isCorrect;

                    let optionClass = 'summary-answer-option';
                    if (isCorrectAnswer) {
                      optionClass += ' summary-answer-correct';
                    } else if (isUserWrongAnswer) {
                      optionClass += ' summary-answer-incorrect';
                    }

                    return (
                      <div key={optionNum} className={optionClass}>
                        {isCorrectAnswer && (
                          <span className="summary-answer-icon">✓</span>
                        )}
                        {isUserWrongAnswer && (
                          <span className="summary-answer-icon">✗</span>
                        )}
                        <span className="summary-answer-text">{optionText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
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

