/**
 * CSV Parser utility
 * Parses CSV files containing question data into Question objects
 */

import { Question } from '../models/question.js';

/**
 * Parse CSV text into an array of Question objects
 * @param {string} csvText - Raw CSV text content
 * @returns {Array<Question>} Array of Question objects
 */
export function parseQuestionsFromCSV(csvText) {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    return []; // Need at least header + 1 data row
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  const headerMap = {};
  headers.forEach((header, index) => {
    headerMap[header.trim()] = index;
  });

  // Validate required headers
  const requiredHeaders = ['Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Correct Answer'];
  const missingHeaders = requiredHeaders.filter(header => !headerMap[header]);
  
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required CSV headers: ${missingHeaders.join(', ')}`);
  }

  // Parse data rows
  const questions = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCSVLine(line);
    
    // Extract values based on header positions
    const questionData = {
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
 * @param {string} line - CSV line text
 * @returns {Array<string>} Array of field values
 */
function parseCSVLine(line) {
  const values = [];
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
 * @param {string} filePath - Path to CSV file (relative to public or data directory)
 * @returns {Promise<Array<Question>>} Promise that resolves to array of Question objects
 */
export async function loadQuestionsFromCSV(filePath) {
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

