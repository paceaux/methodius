import { punctuations, wordSeparators } from './constants';
import { hasPunctuation, hasSpace, sanitizeText } from './functions.tokenizers';
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
}
