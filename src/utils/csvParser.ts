/**
 * CSV Parser utility
 * Parses CSV files containing question data into Question objects
 */

import { Question, QuestionData } from '../models/question.js';

/**
 * Parse CSV text into an array of Question objects
 * @param csvText - Raw CSV text content
 * @returns Array of Question objects
 */
export function parseQuestionsFromCSV(csvText: string): Question[] {
  // Remove BOM if present
  let text = csvText.trim();
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }
  
  // Handle both \r\n and \n line endings
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length < 2) {
    return []; // Need at least header + 1 data row
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  const headerMap: Record<string, number> = {};
  headers.forEach((header, index) => {
    const trimmedHeader = header.trim();
    headerMap[trimmedHeader] = index;
  });

  // Validate required headers
  const requiredHeaders = ['Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Correct Answer'];
  const missingHeaders = requiredHeaders.filter(header => !(header in headerMap));
  
  if (missingHeaders.length > 0) {
    const foundHeaders = Object.keys(headerMap);
    throw new Error(
      `Missing required CSV headers: ${missingHeaders.join(', ')}. ` +
      `Found headers: ${foundHeaders.join(', ')}`
    );
  }

  // Parse data rows
  const questions: Question[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCSVLine(line);
    
    // Extract values based on header positions
    const questionData: QuestionData = {
      question: values[headerMap['Question']] || '',
      topic: values[headerMap['Topic']] || '',
      subtopic: values[headerMap['Subtopic']] || '',
      option1: values[headerMap['Option 1']] || '',
      option2: values[headerMap['Option 2']] || '',
      option3: values[headerMap['Option 3']] || '',
      option4: values[headerMap['Option 4']] || '',
      correctAnswer: parseInt(values[headerMap['Correct Answer']], 10) || null
    };

    // Validate correct answer is between 1-4
    if (questionData.correctAnswer && 
        (questionData.correctAnswer < 1 || questionData.correctAnswer > 4)) {
      console.warn(`Invalid correct answer for question "${questionData.question}": ${questionData.correctAnswer}. Must be 1-4.`);
      questionData.correctAnswer = null;
    }

    questions.push(new Question(questionData));
  }

  return questions;
}

/**
 * Parse a single CSV line, handling quoted values
 * @param line - CSV line text
 * @returns Array of field values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  values.push(current);
  return values;
}

/**
 * Load and parse a CSV file
 * @param filePath - Path to CSV file (relative to public or data directory)
 * @returns Promise that resolves to array of Question objects
 */
export async function loadQuestionsFromCSV(filePath: string): Promise<Question[]> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.statusText}`);
    }
    const csvText = await response.text();
    return parseQuestionsFromCSV(csvText);
  } catch (error) {
    console.error(`Error loading questions from ${filePath}:`, error);
    throw error;
  }
}

