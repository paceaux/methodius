import levenshtein from 'js-levenshtein';

import {
  sanitizeText,
} from './functions.tokenizers';

/**
 * @typedef {object} HammingDistanceResult
 * @property {number} distance - An integer representing edits needed to make one string into the other
 * @property {number} percentDifferent - A float representing the percentage of the string that would change
 * @property {string} [warning] - A message that will be present if the strings are not the same size and therefore result is unreliable
 */
type HammingDistanceResult = {
  distance: number;
  percentDifferent: number;
  warning?: string;
};

/**
 * @description Finds the edit distance between two same-sized strings
 * @param {string} string1 - A string to compare
 * @param {string} string2 - A string to compare
 * @param {boolean } [shouldCountCase=true] - Whether casing counts as an edit
 * @param {boolean } [shouldCountDacritics=false] - Whether casing counts as an edit
 * @returns {HammingDistanceResult} - an object with the distance and percentage of difference
 */
function getHammingDistance(
  string1: string,
  string2: string,
  shouldCountCase: boolean = true,
  shouldCountDiacritics: boolean = false,
) : HammingDistanceResult {
  if (typeof string1 !== 'string' || typeof string2 !== 'string') {
    throw new Error('Both arguments must be a string.');
  }

  let sanitizedString1 =  sanitizeText(string1, shouldCountCase).trim();
  let sanitizedString2 =  sanitizeText(string2, shouldCountCase).trim();

  if (shouldCountDiacritics) {
    sanitizedString1 = shouldCountCase
      ? sanitizedString1.toLowerCase()
      : string1;
    sanitizedString2 = shouldCountCase
      ? sanitizedString2.toLowerCase()
      : string2;
  }
  let distance = 0;

  [...sanitizedString1].forEach((char, str1CharIndex) => {
    if (sanitizedString2[str1CharIndex] !== char) {
      distance += 1;
    }
  });

  const percentage = (distance / sanitizedString1.length);
  const hammingDistance : HammingDistanceResult = {
    distance,
    percentDifferent: percentage,
  };

  if (sanitizedString1.length !== sanitizedString2.length) {
    hammingDistance.warning = 'Arguments are not the same size. Because distance is based on the order of arguments, the distance is not reliable. Use another distance function.';
  }
  return hammingDistance;
}

/**
 * @typedef {object} LevenshteinDistanceResult
 * @property {number} distance - An integer representing edits needed to make one string into the other
 * @property {Map<string, number>} percentDifferent - A map with the key being each argument, and the value is a float representing the percentage of the string that would change
 */
type LevenshteinDistanceResult = {
  distance: number;
  percentDifferent: Map<string, number>;
};

/**
 * @description Finds the edit distance between two strings
 * @param {string} string1 - A string to compare
 * @param {string} string2 - A string to compare
 * @param {boolean } shouldSanitize - remove diacritics and lowercase the strings
 * @returns {LevenshteinDistanceResult} - an object with a distance and a map of the percentage difference of each string
 */
function getLevenshteinDistance(
  string1: string = '',
  string2: string = '',
  shouldSanitize: boolean = true,
) : LevenshteinDistanceResult {
  if (typeof string1 !== 'string' || typeof string2 !== 'string') {
    throw new Error('Both arguments must be a string.');
  }
  const sanitizedString1 = shouldSanitize
    ? sanitizeText(string1).trim()
    : string1.trim();
  const sanitizedString2 = shouldSanitize
    ? sanitizeText(string2).trim()
    : string2.trim();

  const distance = levenshtein(sanitizedString1, sanitizedString2);
  const percentDifferent = new Map();

  percentDifferent.set(sanitizedString1, distance / sanitizedString1.length);
  percentDifferent.set(sanitizedString2, distance / sanitizedString2.length);

  return {
    distance,
    percentDifferent,
  };
}

export {
  getHammingDistance,
  getLevenshteinDistance,
};
