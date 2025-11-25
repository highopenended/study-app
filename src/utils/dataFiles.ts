/**
 * Data files utility
 * Manages the list of available CSV question files
 */

/**
 * List of available CSV question files in the data directory
 * Update this list when adding new CSV files
 */
export const AVAILABLE_DATA_FILES: string[] = [
  'Math Questions.csv',
  'MLO Questions.csv',
  'May Questions.csv',
];

/**
 * Get the full path to a data file
 * @param filename - Name of the CSV file
 * @returns Full path to the file
 */
export function getDataFilePath(filename: string): string {
  return `/data/${filename}`;
}

