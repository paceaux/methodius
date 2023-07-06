import {
  getNGrams,
} from './functions.ngrams';

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
  ] 
  );

  wordsArray.forEach((word) => {
    const wordNgrams = [...word.matchAll(new RegExp(ngram, 'gi'))];
    if (wordNgrams.length > 0) {
      wordNgrams.forEach((wordNgram) => {
        const ngramIndex = wordNgram.index;
        switch (ngramIndex) {
          case 0:
            const start : number = placementMap.get('start') || 0;
            placementMap.set('start', start + 1);
            break;
          case word.length - ngram.length:
            const end: number = placementMap.get('end') || 0;
            placementMap.set('end', end + 1);
            break;
          default:
            const middle : number = placementMap.get('middle') || 0;
            placementMap.set('middle', middle + 1);
            break;
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

/**
 * @description using a collection returned from getNgramCollections, searches for a string and returns what comes before and after it
 * @param  {string} searchText - the string to search for
 * @param  {NGramSequence|nGramCollection} collectionOrSequence - an array of ngrams, or an nGramCollection
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
  siblingSize:number = 1)
  : SiblingsFrequencyMap {
const ngramSiblings : SiblingsFrequencyMap = new Map([
  ['before', new Map()],
  ['after', new Map()],
]);

if (!searchText) return ngramSiblings;

const isSequence = typeof collectionOrSequence[0] === 'string';

const collection = !isSequence
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
export {
  getWordPlacementForNGram,
  getWordPlacementForNGrams,
  getNgramCollections,
  getNgramSiblings,
}