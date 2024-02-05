import {
  hasPunctuation,
  hasSpace,
  getWords,
} from './functions.tokenizers';
import { NGramSequence, Word } from './functions.analysis';

/** a string of <N> adjacent characters from a Word  */
type NGram = string;

/** an array of <N> adjacent words from a text */
type WordNGram = Word[];

/**
 * @description gets ngrams from text
 * @param  {string} text - text to be analyzed
 * @param  {number} [gramSize=2] - size of ngram to be analyzed
 * @returns {NGramSequence} - array of ngrams extracted from a single word
 */
function getNGrams(text:string, gramSize: number = 2) : NGramSequence {
  const bigrams: NGram[] = [];
  for (let i = 0; i < text.length - (gramSize - 1); i += 1) {
    const substring : NGram = text.substring(i, i + gramSize);

    if (
      !hasPunctuation(substring)
        && !hasSpace(substring)
    ) {
      bigrams.push(substring);
    }
  }
  return bigrams;
}

/**
 * @param {string} text - text to be analyzed
 * @param {number} [gramSize=2] - size of ngram to be analyzed
 * @returns {WordNGram[Word]} - array of words
 * @description - This doesn't use sentence punctuation as a boundary. Should it?
 * @example
 *   getWordNGrams("Hello world. how are you?", 3) would return [[hello, world, how], [world, how, are], [how, are, you]]
 */
function getWordNGrams(text:string, gramSize: number = 2) : WordNGram[] {
  const words: Word[] = getWords(text);
  const wordNGrams: WordNGram[] = [];

  for (let i = 0; i < words.length - (gramSize - 1); i += 1) {
    const substring : WordNGram = words.slice(i, i + gramSize);
    wordNGrams.push(substring);
  }
  return wordNGrams;
}

export {
  getNGrams,
  getWordNGrams,
  WordNGram,
  NGram,
};
