import { describe, expect, it } from '@jest/globals';
import {
  getIntersection,
  getUnion,
  getDisjunctiveUnion,
  getDifference
} from '../../src/functions.comparisons';
import {
  getNGrams,
  getWordNGrams,
} from '../../src/functions.ngrams';

import {
  getHammingDistance,
  getLevenshteinDistance,
} from '../../src/functions.distances';


describe('distancing', () => {
  describe('hamming', () => {
    it('will get a hamming distance of two same-sized strings', () => {
      const string1 = "meat";
      const string2 = "meet";
      const hammingDistance = getHammingDistance(string1, string2);
      expect(hammingDistance.differences).toEqual(1);
      expect(hammingDistance.percentDifferent).toEqual(.25);
    })
    it('will optionally consider casing', () => {
      const string1 = "meat";
      const string2 = "Meet";
      const hammingDistance = getHammingDistance(string1, string2, false);
      expect(hammingDistance.differences).toEqual(2);
      expect(hammingDistance.percentDifferent).toEqual(.5);
    });
    it('return null if they are not same length', () => {
      const string1 = "meat";
      const string2 = "meets";
      const hammingDistance = getHammingDistance(string1, string2, false);
      expect(hammingDistance).toEqual(null);
    });
    it('can turn off sanitization to recognize character differences', () => {
      const string1 = "eleve";
      const string2 = "élève";
      const hammingDistance = getHammingDistance(string1, string2, true);
      expect(hammingDistance).toEqual(2);
    });
  });
  describe('levenshtein', () => {
    it('with same length, sees 1 diff', () =>{
      const string1 = "meat";
      const string2 = "meet";
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein).toEqual(1);
    });
    it('meat & feet are 2 diff', () =>{
      const string1 = "meat";
      const string2 = "feet";
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein).toEqual(2);
    });
    it('with same length, sees 3 diff', () =>{
      const string1 = "meat";
      const string2 = "feel";
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein).toEqual(3);
    });
    it('with same length, sees 4 diff', () =>{
      const string1 = "meat";
      const string2 = "fiel";
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein).toEqual(4);
    });
  });
})
