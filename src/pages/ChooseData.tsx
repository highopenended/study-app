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

export default function ChooseData({ onQuestionsLoaded }: ChooseDataProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (filename: string) => {
    setLoading(filename);
    setError(null);

    try {
      const filePath = getDataFilePath(filename);
      const loadedQuestions = await loadQuestionsFromCSV(filePath);
      onQuestionsLoaded(loadedQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
      setLoading(null);
    }
  };

  return (
    <div>
      <h1>Choose Study Data</h1>
      <p>Select a question file to begin:</p>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}
      <ul>
        {AVAILABLE_DATA_FILES.map((filename) => (
          <li key={filename}>
            <button
              onClick={() => handleFileSelect(filename)}
              disabled={loading !== null}
              style={{
                padding: '0.5rem 1rem',
                margin: '0.25rem 0',
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                opacity: loading !== null && loading !== filename ? 0.6 : 1,
              }}
            >
              {loading === filename ? 'Loading...' : filename}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
