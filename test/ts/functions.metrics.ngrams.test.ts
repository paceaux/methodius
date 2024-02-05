import { describe, expect, it } from '@jest/globals';
import {
  getFrequencyMap,
  getPercentMap,
  getTopGrams,
} from '../../src/functions.metrics.ngrams';

describe('getFrequencyMap', () => {
  it('will get a frequency map', () => {
    const map = getFrequencyMap(['he', 'el', 'll', 'lo']);
    expect(map.has('he')).toEqual(true);
    expect(map.has('el')).toEqual(true);
    expect(map.has('ll')).toEqual(true);
    expect(map.has('lo')).toEqual(true);
    expect(map.get('he')).toEqual(1);
    expect(map.get('el')).toEqual(1);
    expect(map.get('ll')).toEqual(1);
    expect(map.get('lo')).toEqual(1);
  });
});
describe('getPercentMap', () => {
  it('will convert a frequency  map to percents', () => {
    const percentMap = getPercentMap(new Map([['he', 1], ['el', 1]]));
    expect(percentMap.has('he')).toEqual(true);
    expect(percentMap.has('el')).toEqual(true);
    expect(percentMap.get('he')).toEqual(0.5);
    expect(percentMap.get('el')).toEqual(0.5);
  });
});
describe('gettopGrams', () => {
  it('will get top grams', () => {
    const map = getFrequencyMap(['he', 'el', 'll', 'll', 'lo']);
    const topGrams = getTopGrams(map, 2);
    expect(topGrams.has('he')).toEqual(true);
    expect(topGrams.has('ll')).toEqual(true);
    expect(topGrams.has('lo')).toEqual(false);
    expect(topGrams.get('ll')).toEqual(2);
  });
});
