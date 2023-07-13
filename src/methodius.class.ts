import { punctuations, wordSeparators } from './constants';
import { hasPunctuation, hasSpace, sanitizeText, getWords } from './functions.tokenizers';
import { getMeanWordSize, getMedianWordSize } from './functions.metrics.words';
import { getNGrams, getWordNGrams } from './functions.ngrams';
import { getFrequencyMap, getPercentMap, getTopGrams } from './functions.metrics.ngrams';
import { getIntersection, getUnion, getDisjunctiveUnion, getComparison} from './functions.comparisons';
import { getWordPlacementForNGram, getWordPlacementForNGrams, getNgramCollections, getNgramSiblings } from './functions.analysis';

export default class Methodius {
  text: string;

  constructor(text:string) {
    this.text = text;
  }
  static punctuations = punctuations;
  static wordSeparators = wordSeparators;
  static hasPunctuation = hasPunctuation;
  static hasSpace = hasSpace;
  static sanitizeText = sanitizeText;
  static getWords = getWords;
  static getMeanWordSize = getMeanWordSize;
  static getMedianWordSize = getMedianWordSize;
  static getNGrams = getNGrams;
  static getWordNGrams = getWordNGrams;
  static getFrequencyMap = getFrequencyMap;
  static getPercentMap = getPercentMap;
  static getTopGrams = getTopGrams;
  static getIntersection = getIntersection;
  static getUnion = getUnion;
  static getDisjunctiveUnion = getDisjunctiveUnion;
  static getComparison = getComparison;
  static getWordPlacementForNGram = getWordPlacementForNGram;
  static getWordPlacementForNGrams = getWordPlacementForNGrams;
  static getNgramCollections = getNgramCollections;
  static getNgramSiblings = getNgramSiblings;

  /**
   * @description lowercased text with diacritics removed
   * @returns  {string} sanitizedText - text that is all lowercase and without Hebrew diacritics
   */
  get sanitizedText() : string {
    return Methodius.sanitizeText(this.text);
  }

  /**
   * @description an array of letters in the text
   * @returns {NGramSequence} - array of letters in text
   */
  get letters(): NGramSequence {
    return Methodius.getNGrams(this.sanitizedText, 1);
  }

  /**
   * @description an array of words in the text
   * @returns {Word} - array of words in text
   */
  get words() : Word[] {
    return Methodius.getWords(this.sanitizedText);
  }

  /**
   * @description The average size of a word
   * @returns {number} float or int
   */
  get meanWordSize() : number {
    return Methodius.getMeanWordSize(this.words);
  }

  /**
   * @description The middle size of a word
   * @returns {number} float or int
   */
  get medianWordSize() : number {
    return Methodius.getMedianWordSize(this.words);
  }

  /**
   * @description an array of letter bigrams in the text
   * @returns {NGramSequence} - array of bigrams in text
   */
  get bigrams() : NGramSequence {
    return Methodius.getNGrams(this.sanitizedText, 2);
  }

  /**
   * @description an array of letter trigrams in the text
   * @returns {NGramSequence} - array of trigrams in text
   */
  get trigrams() : NGramSequence {
    return Methodius.getNGrams(this.sanitizedText, 3);
  }

  /**
   * @description an array of unique letters in the text
   * @returns {string[]} - array of unique letters in text
   */
  get uniqueLetters() : string[] {
    return [...new Set(this.letters)];
  }

  /**
   * @description an array of unique bigrams in the text
   * @returns {string[]} - array of unique bigrams in text
   */
  get uniqueBigrams() : NGramSequence  {
    return [...new Set(this.bigrams)];
  }

  /**
   * @description an array of unique trigrams in the text
   * @returns {string[]} - array of unique trigrams in text
   */
  get uniqueTrigrams() : NGramSequence {
    return [...new Set(this.trigrams)];
  }

  /**
   * @description an array of unique words in the text
   * @returns {Word[]} - array of unique words in text
   */
  get uniqueWords() : Word[]{
    return [...new Set(this.words)];
  }

  /**
   * @description a map of letter frequencies in the sanitized text
   * @returns {FrequencyMap} - map of unique letters in text
   */
  get letterFrequencies() : FrequencyMap {
    return Methodius.getFrequencyMap(this.letters);
  }

  /**
   * @description a map of bigram frequencies in the sanitized text
   * @returns {FrequencyMap} - map of bigram frequencies in text
   */
  get bigramFrequencies() : FrequencyMap {
    return Methodius.getFrequencyMap(this.bigrams);
  }

  /**
   * @description a map of trigram frequencies in the sanitized text
   * @returns {FrequencyMap} - map of trigram frequencies in text
   */
  get trigramFrequencies() :FrequencyMap {
    return Methodius.getFrequencyMap(this.trigrams);
  }

  /**
   * @description a map of word frequencies in the sanitized text
   * @returns {FrequencyMap - map of unique words in text
   */
  get wordFrequencies(): FrequencyMap {
    return Methodius.getFrequencyMap(this.words);
  }

  /**
   * @description a map of letter percentages in the sanitized text
   * @returns {FrequencyMap} - Map of letter frequencies as percentage in text
   */
  get letterPercentages() : FrequencyMap {
    return Methodius.getPercentMap(this.letterFrequencies);
  }

  /**
   * @description a map of bigram frequencies as percentage in the sanitized text
   * @returns {FrequencyMap} - Map of bigram frequencies as percentage in text
   */
  get bigramPercentages() : FrequencyMap {
    return Methodius.getPercentMap(this.bigramFrequencies);
  }

  /**
   * @description a map of the most used trigrams in the text, as a percent
   * @returns {FrequencyMap} - Map of trigram frequencies as percentage in text
   */
  get trigramPercentages() : FrequencyMap {
    return Methodius.getPercentMap(this.trigramFrequencies);
  }

  /**
   * @description a map of placements of letters within words
   * @returns {PlacementsMap} - Map of letter placements in words
   */
  get letterPositions() : PlacementsMap {
    return Methodius.getWordPlacementForNGrams(this.uniqueLetters, this.words);
  }

  /**
   * @description a map of placements of bigrams within words
   * @returns {PlacementsMap} - Map of letter placements in words
   */
  get bigramPositions() : PlacementsMap {
    return Methodius.getWordPlacementForNGrams(this.uniqueBigrams, this.words);
  }

  /**
   * @description a map of placements of trigrams within words
   * @returns {PlacementsMap} - Map of letter placements in words
   */
  get trigramPositions() : PlacementsMap {
    return Methodius.getWordPlacementForNGrams(this.uniqueTrigrams, this.words);
  }
}
