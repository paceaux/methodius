import { NGram } from './types';
import { FrequencyMap } from './functions.analysis';
/**
 * @description converts an array of strings into a map of those strings and number of occurences
 * @param  {NGram[]} ngramArray - array of ngrams
 * @returns {FrequencyMap} - map of ngrams and their frequencies
 */
function getFrequencyMap(ngramArray: NGram[]) : FrequencyMap {
  const frequencies = new Map();
  ngramArray.forEach((ngram) => {
    if (frequencies.has(ngram)) {
      frequencies.set(ngram, frequencies.get(ngram) + 1);
    } else {
      frequencies.set(ngram, 1);
    }
  });
  return frequencies;
}

/**
 * @description converts a frequency map into a map of percentages
 * @param  {FrequencyMap} frequencyMap - map of ngrams and their frequencies
 * @returns {Map<string, number>} - map of ngrams and their percentages
 */
function getPercentMap(frequencyMap: FrequencyMap) : FrequencyMap {
  const percentMap = new Map();
  frequencyMap.forEach((value, key) => {
    percentMap.set(key, value / frequencyMap.size);
  });
  return percentMap;
}

/**
 * @description filters a frequency map into only a small subset of the most frequent ones
 * @param  {FrequencyMap} frequencyMap - map of ngrams and their frequencies
 * @param  {number} [limit=20] - number of top ngrams to return
 * @returns {FrequencyMap} - map of ngrams and their frequencies
 */
function getTopGrams(frequencyMap: FrequencyMap, limit: number = 20) {
  const orderedGrams = [...frequencyMap].sort(
    (entry1, entry2) => entry2[1] - entry1[1],
  );

  const topGrams = orderedGrams.slice(0, limit);

  return new Map(topGrams);
}

export {
  getFrequencyMap,
  getPercentMap,
  getTopGrams,
};
