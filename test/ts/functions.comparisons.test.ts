import { describe, expect, it } from '@jest/globals';
import {
  getIntersection,
  getUnion,
  getDisjunctiveUnion,
  getComparison,
} from '../../src/functions.comparisons';

describe('comparisons', () => {
  describe('intersection', () => {
    it('will get an intersection of two maps', () => {
      const map1 = new Map([
        ['he', 1],
        ['el', 1],
        ['ll', 1],
        ['lo', 1],
      ]);
      const map2 = new Map([
        ['he', 1],
        ['el', 1],
        ['lp', 1],
        ['ps', 1],
      ]);

      const intersection = getIntersection(map1, map2);
      expect(intersection.includes('he')).toEqual(true);
      expect(intersection.includes('el')).toEqual(true);
      expect(intersection.includes('lp')).toEqual(false);
      expect(intersection.includes('lo')).toEqual(false);
    });
    it('will get an intersection of two arrays', () => {
      const map1 = [
        'he',
        'el',
        'll',
        'lo',
      ];
      const map2 = [
        'he',
        'el',
        'lp',
        'ps',
      ];

      const intersection = getIntersection(map1, map2);
      expect(intersection.includes('he')).toEqual(true);
      expect(intersection.includes('el')).toEqual(true);
      expect(intersection.includes('lp')).toEqual(false);
      expect(intersection.includes('lo')).toEqual(false);
    });
    it('will not duplicate items', () => {
      const map1 = [
        'he',
        'el',
        'll',
        'lo',
        'el',
        'he',
      ];
      const map2 = [
        'he',
        'el',
        'lp',
        'ps',
      ];

      const intersection = getIntersection(map1, map2);
      expect(intersection.includes('he')).toEqual(true);
      expect(intersection.includes('el')).toEqual(true);
      expect(intersection.indexOf('he')).toEqual(intersection.lastIndexOf('he'));
      expect(intersection.indexOf('el')).toEqual(intersection.lastIndexOf('el'));
    });
  });
  describe('disjunctiveUnion', () => {
    it('will get a disjunctive union of two maps', () => {
      const map1 = new Map([
        ['he', 1],
        ['el', 1],
        ['ll', 1],
        ['lo', 1],
      ]);
      const map2 = new Map([
        ['he', 1],
        ['el', 1],
        ['lp', 1],
        ['ps', 1],
      ]);

      const [set1, set2] = getDisjunctiveUnion(map1, map2);
      expect(set1.includes('he')).toEqual(false);
      expect(set1.includes('el')).toEqual(false);
      expect(set1.includes('ll')).toEqual(true);
      expect(set1.includes('lo')).toEqual(true);
      expect(set2.includes('he')).toEqual(false);
      expect(set2.includes('el')).toEqual(false);
      expect(set2.includes('lp')).toEqual(true);
      expect(set2.includes('ps')).toEqual(true);
    });
    it('will get a disjunctive union of two arrays', () => {
      const map1 = [
        'he',
        'el',
        'll',
        'lo',
      ];
      const map2 = [
        'he',
        'el',
        'lp',
        'ps',
      ];

      const [set1, set2] = getDisjunctiveUnion(map1, map2);
      expect(set1.includes('he')).toEqual(false);
      expect(set1.includes('el')).toEqual(false);
      expect(set1.includes('ll')).toEqual(true);
      expect(set1.includes('lo')).toEqual(true);
      expect(set2.includes('he')).toEqual(false);
      expect(set2.includes('el')).toEqual(false);
      expect(set2.includes('lp')).toEqual(true);
      expect(set2.includes('ps')).toEqual(true);
    });
    it('will get identical arrays if they are totally unique', () => {
      const map1 = [
        'he',
        'el',
        'll',
        'lo',
      ];
      const map2 = [
        'wo',
        'or',
        'ld',
      ];

      const [set1, set2] = getDisjunctiveUnion(map1, map2);
      expect(set1).toEqual(map1);
      expect(set2).toEqual(map2);
    });
  });
});
describe('getUnion', () => {
  it('turns tio and ion into tion', () => {
    const union = getUnion([...'tio'], [...'ion']);
    const result = union.join('');
    expect(result).toEqual('tion');
  });
  it('turns io and on into ion', () => {
    const union = getUnion([...'io'], [...'on']);
    const result = union.join('');
    expect(result).toEqual('ion');
  });
  it('turns on and it into onit', () => {
    const union = getUnion([...'on'], [...'it']);
    const result = union.join('');
    expect(result).toEqual('onit');
  });
  it('turns on and io into oni', () => {
    const union = getUnion([...'on'], [...'i']);
    const result = union.join('');
    expect(result).toEqual('oni');
  });
});
