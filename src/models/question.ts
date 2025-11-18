/**
 * Question data model
 * Represents a single multiple-choice question with 4 options
 */

export interface QuestionData {
  question: string;
  topic?: string;
  subtopic?: string;
  option1: string | number;
  option2: string | number;
  option3: string | number;
  option4: string | number;
  correctAnswer: number | null;
}

export class Question {
  question: string;
  topic: string;
  subtopic: string;
  option1: string | number;
  option2: string | number;
  option3: string | number;
  option4: string | number;
  correctAnswer: number | null;

  constructor(data: QuestionData) {
    this.question = data.question || '';
    this.topic = data.topic || '';
    this.subtopic = data.subtopic || '';
    this.option1 = data.option1;
    this.option2 = data.option2;
    this.option3 = data.option3;
    this.option4 = data.option4;
    this.correctAnswer = data.correctAnswer;
  }

  /**
   * Get an option by its number (1-4)
   * @param optionNumber - Option number (1-4)
   * @returns The option value
   */
  getOption(optionNumber: number): string | number | null {
    switch (optionNumber) {
      case 1:
        return this.option1;
      case 2:
        return this.option2;
      case 3:
        return this.option3;
      case 4:
        return this.option4;
      default:
        return null;
    }
  }

  /**
   * Get all options as an array
   * @returns Array of all 4 options
   */
  getOptions(): Array<string | number> {
    return [this.option1, this.option2, this.option3, this.option4];
  }

  /**
   * Check if an answer is correct
   * @param answer - Answer number (1-4)
   * @returns True if answer is correct
   */
  isCorrect(answer: number): boolean {
    return this.correctAnswer === answer;
  }
}

