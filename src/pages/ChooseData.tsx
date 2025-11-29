/**
 * ChooseData page component
 * Displays a list of CSV files in the data directory for user selection
 */
import { useState } from 'react';
import { AVAILABLE_DATA_FILES, getDataFilePath } from '../utils/dataFiles';
import { loadQuestionsFromCSV } from '../utils/csvParser';
import { Question } from '../models/question';

interface ChooseDataProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Randomly select and order questions based on max count
 */
function selectRandomQuestions(questions: Question[], maxQuestions: number | null): Question[] {
  if (maxQuestions === null || maxQuestions >= questions.length) {
    return shuffleArray(questions);
  }
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, maxQuestions);
}

export default function ChooseData({ onQuestionsLoaded }: ChooseDataProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [maxQuestions, setMaxQuestions] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename);
    setError(null);
  };

  const handleMaxQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers or empty string
    if (value === '' || /^\d+$/.test(value)) {
      setMaxQuestions(value);
    }
  };

  const handleContinue = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const filePath = getDataFilePath(selectedFile);
      const loadedQuestions = await loadQuestionsFromCSV(filePath);
      const maxQuestionsNum = maxQuestions === '' ? null : parseInt(maxQuestions, 10);
      const selectedQuestions = selectRandomQuestions(loadedQuestions, maxQuestionsNum);
      onQuestionsLoaded(selectedQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1>Choose Study Data</h1>
        <p className="card-text">Select a question file to begin:</p>
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
        <div className="max-questions-field">
          <label htmlFor="max-questions" className="max-questions-label">
            Max Questions per Test
          </label>
          <input
            id="max-questions"
            type="text"
            inputMode="numeric"
            value={maxQuestions}
            onChange={handleMaxQuestionsChange}
            placeholder="No Limit"
            disabled={loading}
            className="max-questions-input"
          />
        </div>
        <ul className="file-list">
          {AVAILABLE_DATA_FILES.map((filename) => (
            <li key={filename}>
              <button
                onClick={() => handleFileSelect(filename)}
                disabled={loading}
                className={`btn-list ${selectedFile === filename ? 'btn-list-selected' : ''}`}
              >
                {filename}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="button-group">
        <button
          onClick={handleContinue}
          disabled={!selectedFile || loading}
          className="btn-primary"
        >
          {loading ? 'Loading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
