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


export {
  getWordPlacementForNGram,
  getWordPlacementForNGrams,
  getNgramCollections
}
