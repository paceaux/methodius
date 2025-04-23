import {
  wordSeparators,
  punctuations,
  symbols,
} from './constants';
import { Word } from './types';

/**
 * @description determines if string contains punctuation
 * @param  {string} text - string to check for punctuation
 * @returns {boolean} - true if string contains punctuation
 */
function hasPunctuation(text: string): boolean {
  const punctuationRegEx = new RegExp(`([${punctuations}])`, 'g');

  return punctuationRegEx.test(text);
}

/**
 * @description determines if a string contains symbols such as #, $ or ^
 * @param  {string} text - string to check for symbols
 * @returns {boolean} - true if string contains symbols
 */
function hasSymbols(text: string): boolean {
  const symbolRegEx = new RegExp(`([${symbols}])`, 'g');

  return symbolRegEx.test(text);
}

/**
 * @description determines if a string has a space
 * @param  {string} text - string to check for space
 * @returns  {boolean} - true if string contains space
 */
function hasSpace(text: string): boolean {
  return text.search(/\s/) !== -1;
}

/**
 * @description lowercases text and removes diacritics and other characters that would throw off n-gram analysis
 * @param  {string} text - string to sanitize
 * @param  {boolean} [shouldLowerCase=true] - also make the string lowercase
 * @returns {string} - string that is optionally lowercased and without Hebrew diacritics
 */
function sanitizeText(text:string, shouldLowerCase: boolean = true): string {
  const stringWithoutDiacritics = text
    .replace(/\u05BE/g, '-')
    .replace(/[\u0591-\u05C7]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');


  const casedString = shouldLowerCase 
    ? stringWithoutDiacritics.toLowerCase()
    : stringWithoutDiacritics;

  return casedString;
}

/**
 * @description extracts an array of words from a string
 * @param {string} text - text to be analyzed
 * @returns {Word[]} - array of words in text
 */
function getWords(text:string) : Word[] {
  const wordSeparatorRegex = new RegExp(
    `[(${wordSeparators})]`,
    'g',
  );
  const wordArray = text
    .split(wordSeparatorRegex)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  return wordArray;
}

export {
  hasPunctuation,
  hasSymbols,
  hasSpace,
  sanitizeText,
  getWords,
};
