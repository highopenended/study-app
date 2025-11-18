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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        marginBottom: '2rem',
      }}>
        <p style={{
          marginBottom: '1.5rem',
          fontSize: '1rem',
          lineHeight: '1.5',
        }}>
          You can take this Practice Exam as many times as you'd like. We recommend retaking the exam until you score at least 80%.
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
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

      <div style={{
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <button
          onClick={onStartExam}
          style={{
            backgroundColor: '#20b2aa',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          Start Exam
        </button>
        <button
          onClick={onBack}
          style={{
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
