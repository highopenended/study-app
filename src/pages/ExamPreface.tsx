/**
 * ExamPreface page component
 * Displays information about the upcoming test (number of questions, passing score, etc.)
 */
import { Question } from '../models/question';

interface ExamPrefaceProps {
  questions: Question[];
  onStartExam: () => void;
  onBack: () => void;
}

export default function ExamPreface({ questions, onStartExam, onBack }: ExamPrefaceProps) {
  const numberOfQuestions = questions.length;

  return (
    <div className="page-container">
      <div className="card">
        <p className="card-text">
          You can take this Practice Exam as many times as you'd like. We recommend retaking the exam until you score at least 80%.
        </p>
        
        <div className="card-info">
          <div>
            <strong>Number of Questions:</strong> {numberOfQuestions}
          </div>
          <div>
            <strong>Passing Grade:</strong> 80%
          </div>
          <div>
            <strong>Time Allowed:</strong> Not Timed
          </div>
        </div>
      </div>

      <div className="button-group">
        <button onClick={onStartExam} className="btn-primary">
          Start Exam
        </button>
        <button onClick={onBack} className="btn-secondary">
          Back
        </button>
      </div>
    </div>
  );
}
