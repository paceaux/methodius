import { describe, expect, it } from '@jest/globals';
import  Methodius  from '../../src/Methodius.class';

describe('static class members', () => {
  it('has static members', () => {
    expect(Methodius).toHaveProperty('punctuations');
    expect(Methodius).toHaveProperty('wordSeparators');
    expect(Methodius).toHaveProperty('hasPunctuation');
    expect(Methodius).toHaveProperty('hasSpace');
    expect(Methodius).toHaveProperty('sanitizeText');
    expect(Methodius).toHaveProperty('getMeanWordSize');
    expect(Methodius).toHaveProperty('getMedianWordSize');
    expect(Methodius).toHaveProperty('getWords');
    expect(Methodius).toHaveProperty('getNGrams');
    expect(Methodius).toHaveProperty('getFrequencyMap');
    expect(Methodius).toHaveProperty('getPercentMap');
    expect(Methodius).toHaveProperty('getTopGrams');
  });
  it('can do stuff hose members', () => {
    expect(Methodius.hasPunctuation('hello, world!')).toBe(true);
    expect(Methodius.hasSpace('hello')).toBe(false);
    expect(Methodius.sanitizeText('Héllö ñ Wòrld')).toEqual('hello n world');
    expect(Methodius.getWords('hello world')).toEqual(['hello', 'world']);
  });
});
