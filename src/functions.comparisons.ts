import { NGramSequence } from './functions.analysis';
// @ts-ignore
import union from 'set.prototype.union';
// @ts-ignore
import intersection from 'set.prototype.intersection';
// @ts-ignore
import symmetricDifference from 'set.prototype.symmetricDifference';
// @ts-ignore
import difference from 'set.prototype.difference';

union.shim();
intersection.shim();
symmetricDifference.shim();
difference.shim();

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
  iterable2: Map<string, string> | Array<string>,
): Intersection {
  const array1 = Array.isArray(iterable1) ? iterable1 : [...iterable1.keys()];
  const array2 = Array.isArray(iterable2) ? iterable2 : [...iterable2.keys()];

  const set = new Set(array1);
  const intersection: Array<string> = [...set.intersection(new Set(array2))];

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
  iterable2: Map<string, string> | Array<string>,
): Array<string> {
  const array1 = Array.isArray(iterable1) ? iterable1 : [...iterable1.keys()];
  const array2 = Array.isArray(iterable2) ? iterable2 : [...iterable2.keys()];
  const set: Set<string> = new Set(array1);

  const union = set.union(new Set(array2));

  return [...union];
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
  iterable2: Map<string, string> | Array<string>,
): DisjunctiveUnion {
  const array1 = Array.isArray(iterable1) ? iterable1 : [...iterable1.keys()];
  const array2 = Array.isArray(iterable2) ? iterable2 : [...iterable2.keys()];

  const set1 = new Set(array1);
  const set2 = new Set(array2);

  const disjunctiveUnionSet = set1.symmetricDifference(set2);

  const disjunctiveUnion2dArray: DisjunctiveUnion = [[], []];

  disjunctiveUnionSet.forEach((item) => {
    if (set1.has(item)) {
      disjunctiveUnion2dArray[0].push(item);
    }
    if (set2.has(item)) {
      disjunctiveUnion2dArray[1].push(item);
    }
  });

  return disjunctiveUnion2dArray;

}

/**
 * @description returns the items unique only to the first iterable
 * @param  {Map|Array} iterable1 A map or array
 * @param  {Map|Array} iterable2 A map or array
 * @returns {Array<string>} An array of arrays of the unique items. The first item is the first parameter, 2nd item second param
 */
function getDifference(
  iterable1: Map<string, string> | Array<string>,
  iterable2: Map<string, string> | Array<string>,
) {
  const array1 = Array.isArray(iterable1) ? iterable1 : [...iterable1.keys()];
  const array2 = Array.isArray(iterable2) ? iterable2 : [...iterable2.keys()];

  const set1 = new Set(array1);
  const set2 = new Set(array2);

  const difference = set1.difference(set2);

  return [...difference];
}

/** The type of way that two NGramSequences can be evaluated */
type SequenceComparisonType = 'intersection' | 'disjunctiveUnion';

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
  iterable2: Map<string, string> | NGramSequence,
) : SequenceComparison {
  const comparison = new Map();
  comparison.set('intersection', getIntersection(iterable1, iterable2));
  comparison.set('disjunctiveUnion', getDisjunctiveUnion(iterable1, iterable2));

  return comparison;
}

export {
  getIntersection,
  getUnion,
  getDisjunctiveUnion,
  getDifference,
  getComparison,
  SequenceComparisonType,
  SequenceComparison,
};
