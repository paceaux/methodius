import { NGramSequence } from './functions.analysis';
import { NGram } from './functions.ngrams';

/** An array of items that occur in two iterables */
type Intersection = Array<string>;

/**
 * @description returns an array of items that occur in both iterables
 * @param  {Map|Array} iterable1 A map or array
 * @param  {Map|Array} iterable2 A map or array
 * @returns {Intersection} An array of items that occur in both iterables. It will compare the keys, if sent a map
 */
function getIntersection(
  iterable1: Map<string, string> | Array<string>,
  iterable2: Map<string, string> | Array<string>
): Intersection {
  const array1 = Array.isArray(iterable1) ? iterable1 : [...iterable1.keys()];
  const array2 = Array.isArray(iterable2) ? iterable2 : [...iterable2.keys()];

  const intersection: Array<string> = [];

  array1.forEach((entry) => {
    if (array2.includes(entry) && !intersection.includes(entry)) {
      intersection.push(entry);
    }
  });

  return intersection;
}

/** an array of items that is the union (joining) of  two iterables */
type Union = Array<string>;

/**
 * @description returns an array that is the union of two iterables
 * @param  {Map|Array} iterable1 A map or array
 * @param  {Map|Array} iterable2 A map or array
 * @returns {Union} An array of items. It will  be the keys if sent a map
 */
function getUnion(
  iterable1: Map<string, string> | Array<string>,
  iterable2: Map<string, string> | Array<string>
): Array<string> {
  const array1 = Array.isArray(iterable1) ? iterable1 : [...iterable1.keys()];
  const array2 = Array.isArray(iterable2) ? iterable2 : [...iterable2.keys()];
  const set: Set<string> = new Set();

  array1.forEach((char) => set.add(char));
  array2.forEach((char) => set.add(char));

  return [...set];
}

/** A Two dimensional array  where the first array is unique items from a first parameter, second is items from second */
type DisjunctiveUnion = Array<Array<string>>;

/**
 * @description returns an array of arrays of the unique items in either iterable
 * @param  {Map|Array} iterable1 A map or array
 * @param  {Map|Array} iterable2 A map or array
 * @returns {DisjunctiveUnion} An array of arrays of the unique items. The first item is the first parameter, 2nd item second param
 */
function getDisjunctiveUnion(
  iterable1: Map<string, string> | Array<string>,
  iterable2: Map<string, string> | Array<string>
): DisjunctiveUnion {
  const array1 = Array.isArray(iterable1) ? iterable1 : [...iterable1.keys()];
  const array2 = Array.isArray(iterable2) ? iterable2 : [...iterable2.keys()];

  const intersection = getIntersection(array1, array2);
  const set1 = array1.filter((entry) => !intersection.includes(entry));
  const set2 = array2.filter((entry) => !intersection.includes(entry));

  return [set1, set2];
}
/** The type of way that two NGramSequences can be evaluated */
type SequenceComparisonType = "intersection" | "disjunctiveUnion";

/** A map containing various comparisons between two iterables */
type SequenceComparison = Map<SequenceComparisonType, Intersection | DisjunctiveUnion>;

/**
 * @description returns a map containing various comparisons between two iterables
 * @param  {Map|NGramSequence} iterable1 an array or map
 * @param  {Map|NGramSequence} iterable2 an array or map
 * @returns {SequenceComparison} A map containing various comparisons between two iterables
 */
function getComparison(
  iterable1: Map<string, string> | NGramSequence,
  iterable2: Map<string, string> | NGramSequence
) : SequenceComparison {
  const comparison = new Map();
  comparison.set("intersection", getIntersection(iterable1, iterable2));
  comparison.set("disjunctiveUnion", getDisjunctiveUnion(iterable1, iterable2));

  return comparison;
}

export {
  getIntersection,
  getUnion,
  getDisjunctiveUnion,
  getComparison,
  SequenceComparisonType,
  SequenceComparison
};
