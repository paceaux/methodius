import { getMeanWordSize } from './functions.metrics.words';
import { NGram } from './functions.ngrams';
import { NGramSequence } from './functions.analysis';

/**
 * @extends Map
 * @description a nested map of maps of ngrams formed from a single word where the deepest structure is an array of bigrams
 * 
 */
class NGramTree extends Map<NGram, NGramTree | NGramSequence> {
  constructor(iterable?: Iterable<readonly [NGram, NGramTree | NGramSequence]>) {
    super(iterable);
  }

  /**
   * @description flattens the tree into an array
   * @param  {number=2} ngramSize the size of the ngrams to include in the array
   * @returns {NGram[]}
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
}

export default NGramTree;
