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
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename);
    setError(null);
  };

  const handleContinue = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const filePath = getDataFilePath(selectedFile);
      const loadedQuestions = await loadQuestionsFromCSV(filePath);
      onQuestionsLoaded(loadedQuestions);
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
