import { describe, expect, it } from '@jest/globals';
import  Methodius  from '../../src/Methodius.class.ts';

describe('instance members', () => {
  it('has all the properties', () => {
    const nGrammer = new Methodius('hello world');
    expect(nGrammer).toHaveProperty('text');
    expect(nGrammer).toHaveProperty('sanitizedText');
    expect(nGrammer).toHaveProperty('letters');
    expect(nGrammer).toHaveProperty('words');
    expect(nGrammer).toHaveProperty('bigrams');
    expect(nGrammer).toHaveProperty('trigrams');
    expect(nGrammer).toHaveProperty('uniqueLetters');
    expect(nGrammer).toHaveProperty('uniqueBigrams');
    expect(nGrammer).toHaveProperty('uniqueTrigrams');
    expect(nGrammer).toHaveProperty('uniqueWords');
    expect(nGrammer).toHaveProperty('letterFrequencies');
    expect(nGrammer).toHaveProperty('bigramFrequencies');
    expect(nGrammer).toHaveProperty('trigramFrequencies');
    expect(nGrammer).toHaveProperty('wordFrequencies');
    expect(nGrammer).toHaveProperty('letterPercentages');
    expect(nGrammer).toHaveProperty('bigramPercentages');
    expect(nGrammer).toHaveProperty('trigramPercentages');
    expect(nGrammer).toHaveProperty('meanWordSize');
    expect(nGrammer).toHaveProperty('medianWordSize');
  });
  it('has good text, sanitization, letters, words, and gram values', () => {
    const nGrammer = new Methodius('hèllo wórld');
    expect(nGrammer).toHaveProperty('text', 'hèllo wórld');
    expect(nGrammer).toHaveProperty('sanitizedText', 'hello world');
    expect(nGrammer).toHaveProperty('letters', ['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd']);
    expect(nGrammer).toHaveProperty('words', ['hello', 'world']);
    expect(nGrammer).toHaveProperty('bigrams', ['he', 'el', 'll', 'lo', 'wo', 'or', 'rl', 'ld']);
    expect(nGrammer).toHaveProperty('trigrams', ['hel', 'ell', 'llo', 'wor', 'orl', 'rld']);
  });
  it('has good values for the unique properties', () => {
    const nGrammer = new Methodius('hèllo wórld');
    expect(nGrammer).toHaveProperty('uniqueLetters', ['h', 'e', 'l', 'o', 'w', 'r', 'd']);
    expect(nGrammer).toHaveProperty('uniqueBigrams', ['he', 'el', 'll', 'lo', 'wo', 'or', 'rl', 'ld']);
    expect(nGrammer).toHaveProperty('uniqueTrigrams', ['hel', 'ell', 'llo', 'wor', 'orl', 'rld']);
    expect(nGrammer).toHaveProperty('uniqueWords', ['hello', 'world']);
  });
  it('has good values for the frequency properties', () => {
    const nGrammer = new Methodius('hèllo wórld');
    expect(nGrammer).toHaveProperty(
      'letterFrequencies',
      new Map([['h', 1], ['e', 1], ['l', 3], ['o', 2], ['w', 1], ['r', 1], ['d', 1]]),
    );
    expect(nGrammer).toHaveProperty(
      'bigramFrequencies',
      new Map([['he', 1], ['el', 1], ['ll', 1], ['lo', 1], ['wo', 1], ['or', 1], ['rl', 1], ['ld', 1]]),
    );
    expect(nGrammer).toHaveProperty(
      'trigramFrequencies',
      new Map([['hel', 1], ['ell', 1], ['llo', 1], ['wor', 1], ['orl', 1], ['rld', 1]]),
    );
    expect(nGrammer).toHaveProperty('wordFrequencies', new Map([['hello', 1], ['world', 1]]));
  });
  it('has good values for the percentage properties', () => {
    const nGrammer = new Methodius('hèllo wórld');
    expect(nGrammer).toHaveProperty(
      'letterPercentages',
      new Map([
        ['h', 0.14285714285714285],
        ['e', 0.14285714285714285],
        ['l', 0.42857142857142855],
        ['o', 0.2857142857142857],
        ['w', 0.14285714285714285],
        ['r', 0.14285714285714285],
        ['d', 0.14285714285714285],
      ]),
    );
    expect(nGrammer).toHaveProperty(
      'bigramPercentages',
      new Map([
        ['he', 0.125],
        ['el', 0.125],
        ['ll', 0.125],
        ['lo', 0.125],
        ['wo', 0.125],
        ['or', 0.125],
        ['rl', 0.125],
        ['ld', 0.125],
      ]),
    );
    expect(nGrammer).toHaveProperty(
      'trigramPercentages',
      new Map([
        ['hel', 0.16666666666666666],
        ['ell', 0.16666666666666666],
        ['llo', 0.16666666666666666],
        ['wor', 0.16666666666666666],
        ['orl', 0.16666666666666666],
        ['rld', 0.16666666666666666],
      ]),
    );
  });
  it('has good values for placement properties', () => {
    const nGrammer = new Methodius('hello world');
    expect(nGrammer).toHaveProperty('bigramPositions');
    expect(nGrammer.bigramPositions.get('he').get('start')).toEqual(1);
    expect(nGrammer.bigramPositions.get('el').get('middle')).toEqual(1);
    expect(nGrammer.bigramPositions.get('ll').get('middle')).toEqual(1);
    expect(nGrammer.bigramPositions.get('lo').get('end')).toEqual(1);
    expect(nGrammer.bigramPositions.get('lo').get('start')).toEqual(0);
    expect(nGrammer.trigramPositions.get('ell').get('start')).toEqual(0);
  });
  it('still has good values for placement properties', () => {
    const nGrammer = new Methodius('hello, help the world\'s words');
    expect(nGrammer).toHaveProperty('bigramPositions');
    expect(nGrammer.bigramPositions.get('he').get('start')).toEqual(2);
    expect(nGrammer.bigramPositions.get('he').get('end')).toEqual(1);
    expect(nGrammer.trigramPositions.get('hel').get('start')).toEqual(2);
    expect(nGrammer.trigramPositions.get('wor').get('start')).toEqual(2);
    expect(nGrammer.bigramPositions.get('el').get('middle')).toEqual(2);
  });
});
