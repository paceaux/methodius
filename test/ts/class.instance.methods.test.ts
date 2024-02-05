import { describe, expect, it } from '@jest/globals';
import  Methodius  from '../../src/Methodius.class.ts';

describe('instance methods', () => {
  const nGrammer = new Methodius('hello world');
  describe('Frequency analysis', () => {
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

describe('instance method: ngram combo discovery', () => {
  it('gets words with top bigrams', () => {
    const nGrammer = new Methodius('the revolution of the nation was on television. It was about pollution and the terrible situation that it has caused. A declaration should be written about it.');
    const words = nGrammer.getWordsContainingTopNgrams(2, 5);
    expect(words).toBeTruthy();
    expect(words.has('revolution')).toBe(true);
    expect(words.has('nation')).toBe(true);
    expect(words.has('of')).toBe(false);

  });
  it('gets words with top trigrams', () => {
    const nGrammer = new Methodius('the revolution of the nation was on television. It was about pollution and the terrible situation that it has caused. A declaration should be written about it.');
    const words = nGrammer.getWordsContainingTopNgrams(3, 5);
    expect(words).toBeTruthy();
    expect(words.has('revolution')).toBe(true);
    expect(words.has('nation')).toBe(true);
    expect(words.has('of')).toBe(false);

  });
  it('will discover ngram combos', () => {
    const nGrammer = new Methodius('the revolution of the nation was on television. It was about pollution and the terrible situation that it has caused. A declaration should be written about it before there is confusion or revision. we are on a mission to make a decision.');
    const relatedNgrams = nGrammer.getRelatedNgrams(2, 5);
    expect(relatedNgrams).toBeTruthy();
    expect(relatedNgrams.has('io')).toBe(true);
    expect(relatedNgrams.has('on')).toBe(true);
    expect(relatedNgrams.has('si')).toBe(true);
    expect(relatedNgrams.get('io')).toBe(10);
    expect(relatedNgrams.get('on')).toBe(10);
  });
  it('will discover ngram combos', () => {
    const nGrammer = new Methodius('they  saw this thing and this these thimbles thoughtfully throwing thorns through the thicket. They thusly thought that they would be through with the therapy. Thespians were not enough, so they fought and it was rough. ');
    const relatedNgrams = nGrammer.getRelatedNgrams(2, 7);
    expect(relatedNgrams).toBeTruthy();
    expect(relatedNgrams.has('th')).toBe(true);
    expect(relatedNgrams.has('he')).toBe(true);
    expect(relatedNgrams.has('hi')).toBe(true);
    expect(relatedNgrams.get('th')).toBe(14);
    expect(relatedNgrams.get('he')).toBe(9);
    expect(relatedNgrams.get('hi')).toBe(5);
  });

});
