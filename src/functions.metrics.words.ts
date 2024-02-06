import { Word } from './types';
/**
 * @description Gets average size of a word
 * @param {Word[]} wordArray - text to be analyzed
 * @returns {number} - float. Average size of word
 */
function getMeanWordSize(wordArray: Word[]) : number {
  const filteredArray = wordArray.filter((word) => word.length > 0);
  const wordSizes = filteredArray.map((word) => word.trim().length);
  const sum = wordSizes.reduce(
    (accumulator, currentVal) => accumulator + currentVal,
    0,
  );
  const mean = sum / wordSizes.length;
  return mean;
}

/**
 * @description Gets median size of a word
 * @param {Word[]} wordArray - text to be analyzed
 * @returns {number} - float. the median word size
 */
function getMedianWordSize(wordArray: Word[]) : number {
  const filteredArray = wordArray.filter((word) => word.length > 0);
  const wordSizes = filteredArray.map((word) => word.trim().length);
  const sortedSizes = wordSizes.sort((first, second) => {
    if (first < second) return -1;
    if (second > first) return 1;
    return 0;
  });
  const isOdd = sortedSizes.length % 2 !== 0;
  const median = isOdd
    ? sortedSizes[Math.floor(sortedSizes.length / 2)]
    : (sortedSizes[sortedSizes.length / 2]
          + sortedSizes[sortedSizes.length / 2 + 1])
        / 2;
  return median;
}
export {
  getMeanWordSize,
  getMedianWordSize,
};
