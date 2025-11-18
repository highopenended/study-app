/**
 * Question data model
 * Represents a single multiple-choice question with 4 options
 */
export class Question {
  /**
   * @param {Object} data - Question data
   * @param {string} data.question - The question text
   * @param {string} data.topic - Topic category (can be blank)
   * @param {string} data.subtopic - Subtopic category (can be blank)
   * @param {string|number} data.option1 - First answer option
   * @param {string|number} data.option2 - Second answer option
   * @param {string|number} data.option3 - Third answer option
   * @param {string|number} data.option4 - Fourth answer option
   * @param {number} data.correctAnswer - Correct answer (1-4)
   */
  constructor(data) {
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
   * @param {number} optionNumber - Option number (1-4)
   * @returns {string|number} The option value
   */
  getOption(optionNumber) {
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
   * @returns {Array<string|number>} Array of all 4 options
   */
  getOptions() {
    return [this.option1, this.option2, this.option3, this.option4];
  }

  /**
   * Check if an answer is correct
   * @param {number} answer - Answer number (1-4)
   * @returns {boolean} True if answer is correct
   */
  isCorrect(answer) {
    return this.correctAnswer === answer;
  }
}

