import {
  Word,
  NGramSequence,
  NGram,
  NGramCollection,
} from './types';

import {
  getNGrams,
} from './functions.ngrams';

import NGramTree from './ngramtree.class';

/** The positions within a word where an ngram can occur */
type Positions = 'start' | 'middle' | 'end';

/** Frequency of placements of a single ngram in a word */
type PlacementMap = Map<Positions, number>;

/** Frequency of placements of many ngrams within words */
type PlacementsMap = Map<NGram, PlacementMap>;

/** a map of ngrams and their frequencies as either an integer or percentage */
type FrequencyMap = Map<NGram, number>;

/** a map of words and their ngram trees */
type NGramTreeCollection = Map<Word, NGramTree | NGramSequence>;

/**
 * @description determines the placement of a single ngram in an array of words
 * @param  {NGram} ngram - a unigram, bigram, trigram, or ngram
 * @param  {Word[]} wordsArray - an array of words
 * @returns {PlacementMap} - a map with the keys 'start', 'middle', and 'end'
 */
function getWordPlacementForNGram(ngram: NGram, wordsArray: Word[]) : PlacementMap {
  const placementMap : PlacementMap = new Map([
    ['start', 0],
    ['middle', 0],
    ['end', 0],
  ]);

  wordsArray.forEach((word) => {
    const wordNgrams = [...word.matchAll(new RegExp(ngram, 'gi'))];
    if (wordNgrams.length > 0) {
      wordNgrams.forEach((wordNgram) => {
        const ngramIndex = wordNgram.index;
        switch (ngramIndex) {
          case 0: {
            const start : number = placementMap.get('start') || 0;
            placementMap.set('start', start + 1);
            break;
          }
          case word.length - ngram.length: {
            const end: number = placementMap.get('end') || 0;
            placementMap.set('end', end + 1);
            break;
          }
          default: {
            const middle : number = placementMap.get('middle') || 0;
            placementMap.set('middle', middle + 1);
            break;
          }
        }
      });
    }
  });
  return placementMap;
}

/**
 * @description determines the placement of ngrams in an array of words
 * @param  {NGram[]} ngrams - an array of ngrams
 * @param  {Word[]} wordsArray - an array of words
 * @returns {PlacementsMap} - a map with the key of the ngram, and the value that is a map containing start, middle, end
 */
function getWordPlacementForNGrams(ngrams: NGram[], wordsArray: Word[]) : PlacementsMap {
  const wordPlacements : PlacementsMap = new Map();
  const uniqueNgrams = [...new Set(ngrams)];

  uniqueNgrams.forEach((ngram) => {
    wordPlacements.set(
      ngram,
      getWordPlacementForNGram(ngram, wordsArray),
    );
  });

  return wordPlacements;
}

/**
 * @description gets ngrams from an array of words
 * @param {Word[]} wordArray - an array of words
 * @param {number} [ngramSize=2] - the size of the ngrams to return
 * @returns {NGramCollection} - An array of NGramSequences extracted from an array of words
 */
function getNgramCollections(wordArray: Word[], ngramSize : number = 2) : NGramCollection {
  const ngramCollections : NGramCollection = [];

  wordArray.forEach((word) => {
    ngramCollections.push(getNGrams(word, ngramSize));
  });
  return ngramCollections;
}

/** The relative positions one NGram can have to another */
type RelativePosition = 'before' | 'after';

/** The frequency of a given relative position that <Ngram> has had to <NGram> */
type SiblingsFrequencyMap = Map<RelativePosition, FrequencyMap>;

/**
 * @description using a collection returned from getNgramCollections, searches for a string and returns what comes before and after it
 * @param  {string} searchText - the string to search for
 * @param  {NGramSequence|NGramCollection} collectionOrSequence - an array of ngrams, or an nGramCollection
 * @param  {number} [siblingSize=1] - how many siblings to find in front or behind
 * @returns {SiblingsFrequencyMap} - a Map with the keys 'before' and 'after' which contain maps of what comes before and after
 * @example
 *    const words = ['revolution', 'nation'];
    const ngramCollections = Methodius.getNgramCollections(words, 2);
    const onSiblings = Methodius.getNgramSiblings('io', ngramCollections);
    onSiblings === new Map([
      ['before', new Map(
        ['ti', 2]
      )],
      ['after', new Map(
        ['on', 2]
      )]
    ])
 */
function getNgramSiblings(
  searchText:string,
  collectionOrSequence: NGramSequence|NGramCollection,
  siblingSize:number = 1,
)
  : SiblingsFrequencyMap {
  const ngramSiblings : SiblingsFrequencyMap = new Map([
    ['before', new Map()],
    ['after', new Map()],
  ]);

  if (!searchText) return ngramSiblings;

  const isSequence = typeof collectionOrSequence[0] === 'string';

  const collection = isSequence
    ? [[...collectionOrSequence]] as NGramCollection
    : collectionOrSequence as NGramCollection;

  collection.forEach((ngramSequence: NGramSequence) => {
    const ngramIndex = ngramSequence.indexOf(searchText);
    if (ngramIndex > -1) {
      const isFirst = ngramIndex === 0;
      const isLast = ngramIndex === ngramSequence.length - 1;
      const siblingsSliceStart = isFirst ? 0 : ngramIndex - siblingSize;
      const siblingsSliceEnd = isLast
        ? ngramSequence.length
        : ngramIndex + siblingSize + 1;
      const siblingsSlice = ngramSequence.slice(
        siblingsSliceStart,
        siblingsSliceEnd,
      );
      const siblingsSliceSearchIndex = siblingsSlice.indexOf(searchText);

      siblingsSlice.forEach((sibling: NGram, siblingIndex: number) => {
        if (siblingIndex === siblingsSliceSearchIndex) {
          return;
        }
        const siblingPosition: RelativePosition = siblingIndex < siblingsSliceSearchIndex ? 'before' : 'after';
        const hasSibling = ngramSiblings.get(siblingPosition)?.has(sibling);
        if (!hasSibling) {
          ngramSiblings.get(siblingPosition)?.set(sibling, 1);
        } else {
          const currentPosition = ngramSiblings?.get(siblingPosition);
          const currentPositionCountOfSibling = currentPosition?.get(sibling) || 0; // only here to appease TS
          currentPosition
            ?.set(sibling, currentPositionCountOfSibling + 1);
        }
      });
    }
  });

  return ngramSiblings;
}

/**
 *
 * @description Recursively creates a nested tree of ngrams from a  where the innermost part will be bigrams
 * @param  {Word|NGram} word - a word from which the tree is created
 * @returns {NGramTree | NGramSequence} - a tree of ngrams
 */
function getNgramTree(word:Word|NGram) : NGramTree | NGramSequence {
  if (!word || typeof word !== 'string') {
    throw new Error('getNgramTree requires a word');
  }

  const wordLength = word?.length || 0;
  const ngramSize : number = wordLength - 1;

  if (ngramSize < 2) {
    return getNGrams(word, 1);
  }
  const ngrams : NGramSequence = getNGrams(word, ngramSize);
  const ngramTree = new NGramTree();
  ngrams.forEach((ngram) => {
    if (ngramTree.has(ngram)) {
      return;
    }
    if (ngram.length >= 2) {
      ngramTree.set(ngram, getNgramTree(ngram));
    }
  });

  return ngramTree;
}

/**
 * @description creates a map of words with their respective ngram trees
 * @param  {Word[]} words -the words from which ngram trees are created
 * @returns {NGramTreeCollection} A collection of ngram trees
 */
function getNgramTreeCollection(words:Word[]) : NGramTreeCollection {
  const ngramTreeCollection : NGramTreeCollection = new Map();
  const uniqueWords : Word[] = [...new Set(words)];

  uniqueWords.forEach((word) => {
    if (word && !ngramTreeCollection.has(word)) {
      ngramTreeCollection.set(word, getNgramTree(word));
    }
  });

  return ngramTreeCollection;
}

/**
 * @description gets the ngrams that occur before and after other ngrams
 * @param  {Word[]} words - an array of words
 * @param  {FrequencyMap} ngrams - a frequency map of ngrams
 * @param  {number} [ngramSize=2] - the size of the ngram
 * @returns {FrequencyMap} - a map of ngrams and their frequencies
 */
function getRelatedNgrams(words: Word[], ngrams: FrequencyMap, ngramSize: number = 2) : FrequencyMap {
  if (!words || !ngrams) {
    throw new Error('getRelatedNgrams requires an array of words and an array of ngrams');
  }

  const relatedNgrams = new Map();
  // now,go through words
  words.forEach((word) => {
    // let's split the word back into ngrams.
    const wordNgrams = getNGrams(word, ngramSize);

    // loop through our freshly split ngrams
    wordNgrams.forEach((ngram: NGram, ngramIndex: number) => {
      // we want the one before and the one after
      const previousNgram = wordNgrams[ngramIndex - 1];
      const nextNgram = wordNgrams[ngramIndex + 1];
      const hasPrevAndCurrent = ngrams.has(previousNgram) && ngrams.has(ngram);
      const hasNextAndCurrent = ngrams.has(ngram) && ngrams.has(nextNgram);

      // we have a case where it's either previous and current are both common,
      // or current and next are both common
      if (hasPrevAndCurrent || hasNextAndCurrent) {
        // our list didn't have it, so we add it
        if (!relatedNgrams.has(ngram)) {
          relatedNgrams.set(ngram, 1);
        } else {
          relatedNgrams.set(ngram, relatedNgrams.get(ngram) + 1);
        }
      }
    });
  });

  return relatedNgrams;
}

export {
  getWordPlacementForNGram,
  getWordPlacementForNGrams,
  getNgramCollections,
  getNgramSiblings,
  Word,
  NGramSequence,
  NGramCollection,
  Positions,
  PlacementMap,
  PlacementsMap,
  RelativePosition,
  FrequencyMap,
  SiblingsFrequencyMap,
  getNgramTree,
  getNgramTreeCollection,
  NGramTreeCollection,
  getRelatedNgrams,
  NGram,
};
