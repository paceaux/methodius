import { describe, expect, it } from '@jest/globals';
import  Methodius  from '../../src/Methodius.class.ts';

describe('instance methods', () => {
  const nGrammer = new Methodius('hello world');
  it('will get the top letters', () => {
    expect(nGrammer.getTopLetters(1))
      .toEqual(new Map(
        [
          ['l', 3],
        ],
      ));
    expect(nGrammer.getTopLetters(2))
      .toEqual(new Map(
        [
          ['l', 3],
          ['o', 2],
        ],
      ));
  });
  it('will get the top bigrams', () => {
    expect(nGrammer.getTopBigrams(1))
      .toEqual(new Map(
        [
          ['he', 1],
        ],
      ));
    expect(nGrammer.getTopBigrams(2))
      .toEqual(new Map(
        [
          ['he', 1],
          ['el', 1],
        ],
      ));
  });
  it('will get the top trigrams', () => {
    expect(nGrammer.getTopTrigrams(1))
      .toEqual(new Map(
        [
          ['hel', 1],
        ],
      ));
    expect(nGrammer.getTopTrigrams(2))
      .toEqual(new Map(
        [
          ['hel', 1],
          ['ell', 1],
        ],
      ));
  });
  it('will get the top words', () => {
    expect(nGrammer.getTopWords(1))
      .toEqual(new Map(
        [
          ['hello', 1],
        ],
      ));
    expect(nGrammer.getTopWords(2))
      .toEqual(new Map(
        [
          ['hello', 1],
          ['world', 1],
        ],
      ));
  });
  it('can get an arbitrary letterNgram', () => {
    expect(nGrammer.getLetterNGrams(2)).toEqual([
      'he',
      'el',
      'll',
      'lo',
      'wo',
      'or',
      'rl',
      'ld',
    ]);
  });
  describe('comparison method', () => {
    it('will compare two ngrammers', () => {
      const nGrammer1 = new Methodius('hello world');
      const nGrammer2 = new Methodius('Help words');
      const comparison = nGrammer1.compareTo(nGrammer2);

      expect(comparison).toBeInstanceOf(Map);
      expect(comparison.has('letters')).toBe(true);
      expect(comparison.get('bigrams').has('disjunctiveUnion')).toBe(true);
      expect(comparison.get('trigrams').has('intersection')).toBe(true);
      expect(comparison.has('words')).toBe(true);
    });
    it('will compare two ngrammers and give good results', () => {
      const nGrammer1 = new Methodius('hello world');
      const nGrammer2 = new Methodius('Help words');
      const comparison = nGrammer1.compareTo(nGrammer2);

      expect(comparison).toBeInstanceOf(Map);
      expect(comparison.get('letters').get('intersection')).toEqual(['h', 'e', 'l', 'o', 'w', 'r', 'd']);
      expect(comparison.get('letters').get('disjunctiveUnion')).toEqual([[], ['p', 's']]);
      expect(comparison.get('bigrams').get('intersection')).toEqual(['he', 'el', 'wo', 'or']);
      expect(comparison.get('trigrams').get('disjunctiveUnion')).toEqual([['ell', 'llo', 'orl', 'rld'], ['elp', 'ord', 'rds']]);
    });
  });
});
