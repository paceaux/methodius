import { describe, expect, it } from '@jest/globals';

import {
  getHammingDistance,
  getLevenshteinDistance,
} from '../../src/functions.distances';

describe('distancing', () => {
  describe('hamming', () => {
    it('throws an error if both arguments are not strings', () => {
      const string1 = 'meat';
      expect(() => {
        getHammingDistance(string1);
      }).toThrow('Both arguments must be a string.');
    });
    it('has a warning if strings are not the same size', () => {
      const string1 = 'meat';
      const string2 = 'meets';
      const hammingDistance = getHammingDistance(string1, string2, false);
      expect(hammingDistance).toHaveProperty('warning');
    });
    it('will get a hamming distance of two same-sized strings', () => {
      const string1 = 'meat';
      const string2 = 'meet';
      const hammingDistance = getHammingDistance(string1, string2);
      expect(hammingDistance.distance).toEqual(1);
      expect(hammingDistance.percentDifferent).toEqual(0.25);
    });
    it('is commutative', () => {
      const string1 = 'feet';
      const string2 = 'feel';
      const hammingDistance1 = getHammingDistance(string1, string2);
      const hammingDistance2 = getHammingDistance(string2, string1);
      expect(hammingDistance1.distance).toEqual(hammingDistance2.distance);
    });
    it('ignores diacritics by default', () => {
      const string1 = 'eleve';
      const string2 = 'élève';
      const hammingDistance = getHammingDistance(string1, string2);
      expect(hammingDistance.distance).toEqual(0);
    });
    it('can recognize diacritics and consider them edits', () => {
      const string1 = 'eleve';
      const string2 = 'élève';
      const hammingDistance = getHammingDistance(string1, string2, false);
      expect(hammingDistance.distance).toEqual(2);
    });
    it('will optionally consider casing', () => {
      const string1 = 'meat';
      const string2 = 'Meet';
      const hammingDistance = getHammingDistance(string1, string2, false);
      expect(hammingDistance.distance).toEqual(2);
      expect(hammingDistance.percentDifferent).toEqual(0.5);
    });
  });
  describe('levenshtein', () => {
    it('throws an error if both arguments are not strings', () => {
      const string1 = undefined;
      const string2 = null;
      expect(() => {
        getLevenshteinDistance(string1, string2);
      }).toThrow('Both arguments must be a string');
    });
    it('works when first string is empty', () => {
      const string1 = 'meet';
      const string2 = '';
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein.distance).toEqual(4);
    });
    it('works when second string is empty', () => {
      const string1 = '';
      const string2 = 'meet';
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein.distance).toEqual(4);
    });
    it('with same length, sees 1 diff', () => {
      const string1 = 'meat';
      const string2 = 'meet';
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein.distance).toEqual(1);
      expect(levenshtein.percentDifferent.get('meat')).toEqual(0.25);
    });
    it('meat & feet are 2 diff', () => {
      const string1 = 'meat';
      const string2 = 'feet';
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein.distance).toEqual(2);
      expect(levenshtein.percentDifferent.get('meat')).toEqual(0.5);
      expect(levenshtein.percentDifferent.get('feet')).toEqual(0.5);
    });
    it('with same length, sees 3 diff', () => {
      const string1 = 'meat';
      const string2 = 'feel';
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein.distance).toEqual(3);
    });
    it('with same length, sees 4 diff', () => {
      const string1 = 'meat';
      const string2 = 'fiel';
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein.distance).toEqual(4);
    });
    it('is commutative when arguments are same sizes', () => {
      const string1 = 'feet';
      const string2 = 'meet';
      const levenshtein1 = getLevenshteinDistance(string1, string2);
      const levenshtein2 = getLevenshteinDistance(string2, string1);
      expect(levenshtein1.distance).toEqual(1);
      expect(levenshtein1.distance).toEqual(levenshtein2.distance);
    });
    it('is commutative when arguments are different sizes', () => {
      const string1 = 'feeling';
      const string2 = 'meet';
      const levenshtein1 = getLevenshteinDistance(string1, string2);
      const levenshtein2 = getLevenshteinDistance(string2, string1);
      expect(levenshtein1.distance).toEqual(levenshtein2.distance);
    });

    it('ignores diacritics by default', () => {
      const string1 = 'résumé';
      const string2 = 'resume';
      const levenshtein = getLevenshteinDistance(string1, string2);
      expect(levenshtein.distance).toEqual(0);
    });
    it('can recognize diacritics and consider them edits', () => {
      const string1 = 'résumé';
      const string2 = 'resume';
      const levenshtein = getLevenshteinDistance(string1, string2, false);
      expect(levenshtein.distance).toEqual(2);
    });
  });
});
