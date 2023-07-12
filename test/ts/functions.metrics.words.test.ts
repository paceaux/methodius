import { describe, expect, it } from '@jest/globals';
import {
  getMeanWordSize,
  getMedianWordSize,
} from '../../src/functions.metrics.words';

describe('wordSize', () => {
  it('will get the mean word size from an array of words', () => {
    const words = ['it', 'will', 'get', 'the', 'mean'];
    const mean = getMeanWordSize(words);
    expect(mean).toEqual((2 + 4 + 3 + 3 + 4) / 5);
  });
  it('will get the median word size from an odd sized array of words', () => {
    const words = ['it', 'will', 'get', 'the', 'mean'];
    const median = getMedianWordSize(words);
    expect(median).toEqual(3);
  });
  it('will get the median word size from an even sized array of words', () => {
    const words = ['it', 'will', 'get', 'the'];
    const median = getMedianWordSize(words);
    expect(median).toEqual(3.5);
  });
});
