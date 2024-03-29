import { getMeanWordSize } from './functions.metrics.words';
import { NGram, NGramSequence } from './types';

/**
 * @augments Map
 * @description a nested map of maps of ngrams formed from a single word where the deepest structure is an array of bigrams
 */
// This is a class that's recursive; it can contain a map of itself or an array of ngrams. ESLint doesn't know this.
/* eslint-disable-next-line no-use-before-define */
class NGramTree extends Map<NGram, NGramTree | NGramSequence> {
  // I know eslint thinks this is useless, but I want to clearly communicate how I expect this to be used.
  /* eslint-disable-next-line no-useless-constructor */
  constructor(iterable?: Iterable<readonly [NGram, NGramTree | NGramSequence]>) {
    super(iterable);
  }

  /**
   * @description flattens the tree into an array
   * @param  {number} [ngramSize = 2] the size of the ngrams to include in the array
   * @returns {NGram[]} - a flattened array of ngrams
   */
  flatten(ngramSize: number = 2) : NGram[] {
    const ngramArray = [] as NGram[];
    this.forEach((value, key) => {
      const hasTree = value instanceof NGramTree;
      const hasTreeSmallerThanNGramSize = hasTree && ngramSize > value?.ngramSize;
      if (!hasTree || hasTreeSmallerThanNGramSize) {
        ngramArray.push(key);
      } else {
        ngramArray.push(...value.flatten(ngramSize));
      }
    });
    return [...new Set(ngramArray)];
  }

  /**
   * @description will return the rounded average length of an ngram in the map
   * @returns {number} - the average length of an ngram in the map
   * @readonly
   */
  get ngramSize() : number {
    // look, ideally all keys would be the same size but let's not assume that to be true
    const keys = [...this.keys()] as string[];
    const meanKeySize = getMeanWordSize(keys);
    return Math.round(meanKeySize);
  }

  /**
   * @description will return the depth of the tree
   * @returns {number} - the depth of the tree (0 means this is a map of bigrams)
   * @readonly
   */
  get depth() : number {
    let depth = 0;
    if (this.ngramSize > 2) {
      const firstItem = this.values().next().value;
      const firstItemDepth = firstItem.depth;
      depth = firstItemDepth + 1;
    }
    return depth;
  }

  /**
   * @description will determine if any part of the tree contains the ngram
   * @param  {NGram} ngram - an ngram
   * @returns {boolean} whether the tree contains the ngram
   */
  hasDeep(ngram: NGram) : boolean {
    const nGramSize = ngram.length;
    if (!nGramSize) return false;

    const ngramsOfMatchingSize = this.flatten(ngram.length);
    const hasNGram = ngramsOfMatchingSize.includes(ngram);
    // for sake of performance, don't try a partial match unless it comes up false in the keys
    return hasNGram || ngramsOfMatchingSize
      .some((ngramOfMatchingSize) => ngramOfMatchingSize.includes(ngram));
  }

  /**
   * @description convenience method for hasDeep that determines if _all_ ngrams are present in the tree
   * @param {NGram[]} ngrams - an array of ngrams
   * @returns {boolean} whether the tree contains all of the ngrams
   */
  hasMany(ngrams: NGram[]) : boolean {
    const hasMany = ngrams.every((ngram) => this.hasDeep(ngram));
    return hasMany;
  }

  /**
   * @description will determine if all of the ngrams are contained in the tree
   * @param {NGram[]} ngrams - an array of ngrams
   * @returns {boolean} whether the tree contains any of the ngrams
   */
  hasAny(ngrams: NGram[]) : boolean {
    const hasMany = ngrams.some((ngram) => this.hasDeep(ngram));
    return hasMany;
  }

  /**
   * @description will return an array of ngrams that are present in the tree based on the array provided
   * @param  {NGram[]} ngrams - an array of ngrams
   * @returns {NGram[]} - an array of ngrams that are present in the tree
   */
  hasWhich(ngrams: NGram[]) : NGram[] {
    const hasWhich = ngrams.filter((ngram) => this.hasDeep(ngram));
    return hasWhich;
  }

  /**
   * @description will return the key that contains the ngram you provide it
   * @param  {NGram[]|NGram} ngram - either a string that's an ngram or an array of ngrams
   * @returns {string|[string]} - the key that contains the ngram
   */
  keyContaining(ngram: NGram[] | NGram) : string | [string] {
    let ngramSequence = ngram;
    if (!Array.isArray(ngram)) {
      ngramSequence = [ngram];
    }

    const ngramSize = ngramSequence[0].length;
    let keyContaining: string | Array<string> = '';
    this.forEach((value, key) => {
      if (value instanceof NGramTree && value.hasMany(ngramSequence as NGram[])) {
        if (key.length === ngramSize + 1) {
          keyContaining = key;
        } else {
          keyContaining = value.keyContaining(ngramSequence);
        }
      }
      // if the value is an array, this is the smallest set we can go
      // that means the key is two letters and the array should have single letters
      // there's a fun edge case where, given "t" and "[at, ti]", it occurs in both. So we need to return two keys
      if (Array.isArray(value)) {
        const hasSome = value.includes(ngramSequence[0]);
        if (hasSome) {
          if (!keyContaining) {
            keyContaining = key;
          } else {
            keyContaining = [keyContaining as string, key as string];
          }
        }
      }
    });

    return keyContaining;
  }
}

export default NGramTree;
