const Methodius = require('../src/methodius.class');

describe('NGrammer', () => {
  describe('static class members', () => {
    it('has static members', () => {
      expect(Methodius).toHaveProperty('punctuations');
      expect(Methodius).toHaveProperty('wordSeparators');
      expect(Methodius).toHaveProperty('hasPunctuation');
      expect(Methodius).toHaveProperty('hasSpace');
      expect(Methodius).toHaveProperty('sanitizeText');
      expect(Methodius).toHaveProperty('getWords');
      expect(Methodius).toHaveProperty('getNGrams');
      expect(Methodius).toHaveProperty('getFrequencyMap');
      expect(Methodius).toHaveProperty('getPercentMap');
      expect(Methodius).toHaveProperty('getTopGrams');
    });
    it('has all the common punctuations', () => {
      expect(Methodius.punctuations).toEqual(
        "\\.,;:!?‽¡¿⸘()\\[\\]{}<>’'…\"\n\t\r",
      );
    });
    it('has common word Separators', () => {
      expect(Methodius.wordSeparators).toEqual('—\\.,;:!?‽¡¿⸘()\\[\\]{}<>…"\\s');
    });
    it('can determine if a bit of text has common punctuations', () => {
      expect(Methodius.hasPunctuation('hello, world!')).toBe(true);
      expect(Methodius.hasPunctuation('hello world')).toBe(false);
      expect(Methodius.hasPunctuation('"hello" world')).toBe(true);
      expect(Methodius.hasPunctuation('hello')).toBe(false);
      expect(Methodius.hasPunctuation('Don\'t shouldn\'t')).toBe(true);
    });
    it('can determine if a bit of text has spaces', () => {
      expect(Methodius.hasSpace('hello world')).toBe(true);
      expect(Methodius.hasSpace('hello')).toBe(false);
      expect(Methodius.hasSpace('hello world')).toBe(true);
      expect(Methodius.hasSpace('hello world')).toBe(true);
      expect(Methodius.hasSpace('hello world')).toBe(true);
      expect(Methodius.hasSpace('hello world')).toBe(true);
    });
    it('can normalize and sanitize Hebrew Text', () => {
      expect(Methodius.sanitizeText('תְּהִלִּים')).toEqual('תהלים');
    });
    it('can normalize and sanitize Latin text', () => {
      expect(Methodius.sanitizeText('Hello World')).toEqual('hello world');
      expect(Methodius.sanitizeText('Héllö ñ Wòrld')).toEqual('hello n world');
    });
    it('can get words from a string', () => {
      expect(Methodius.getWords('hello world')).toEqual(['hello', 'world']);
      expect(Methodius.getWords('hello,world')).toEqual(['hello', 'world']);
      expect(Methodius.getWords('hello, world')).toEqual(['hello', 'world']);
      expect(Methodius.getWords('hello world there')).toEqual(['hello', 'world', 'there']);
    });
  });
  describe('static class methods', () => {
    describe('getNGrams', () => {
      it('will get a default size of 2 ', () => {
        expect(Methodius.getNGrams('hello world')).toEqual(
          ['he', 'el', 'll', 'lo', 'wo', 'or', 'rl', 'ld'],
        );
        expect(Methodius.getNGrams('hello,world')).toEqual(
          ['he', 'el', 'll', 'lo', 'wo', 'or', 'rl', 'ld'],
        );
        expect(Methodius.getNGrams('hello.world')).toEqual(
          ['he', 'el', 'll', 'lo', 'wo', 'or', 'rl', 'ld'],
        );
        expect(Methodius.getNGrams('hello.(world)')).toEqual(
          ['he', 'el', 'll', 'lo', 'wo', 'or', 'rl', 'ld'],
        );
      });
      it('will get a size of 3 ', () => {
        expect(Methodius.getNGrams('hello world', 3)).toEqual(
          ['hel', 'ell', 'llo', 'wor', 'orl', 'rld'],
        );
        expect(Methodius.getNGrams('hello,world', 3)).toEqual(
          ['hel', 'ell', 'llo', 'wor', 'orl', 'rld'],
        );
        expect(Methodius.getNGrams('hello.world', 3)).toEqual(
          ['hel', 'ell', 'llo', 'wor', 'orl', 'rld'],
        );
      });
    });
    describe('getWordNGrams', () => {
      it('will get a default size of 2 ', () => {
        expect(Methodius.getWordNGrams('hello world')).toEqual(
          [['hello', 'world']],
        );
        expect(Methodius.getWordNGrams('hello,world')).toEqual(
          [['hello', 'world']],
        );
        expect(Methodius.getWordNGrams('hello.world')).toEqual(
          [['hello', 'world']],
        );
        expect(Methodius.getWordNGrams('hello.(world)')).toEqual(
          [['hello', 'world']],
        );
      });
      it('will get a size of 3 ', () => {
        expect(Methodius.getWordNGrams('hello there world. How are You', 3)).toEqual(
          [
            ['hello', 'there', 'world'],
            ['there', 'world', 'How'],
            ['world', 'How', 'are'],
            ['How', 'are', 'You'],
          ],
        );
      });
    });
    describe('getFrequencyMap', () => {
      it('will get a frequency map', () => {
        const map = Methodius.getFrequencyMap(['he', 'el', 'll', 'lo']);
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
        const percentMap = Methodius.getPercentMap(new Map([['he', 1], ['el', 1]]));
        expect(percentMap.has('he')).toEqual(true);
        expect(percentMap.has('el')).toEqual(true);
        expect(percentMap.get('he')).toEqual(0.5);
        expect(percentMap.get('el')).toEqual(0.5);
      });
    });
    describe('gettopGrams', () => {
      it('will get top grams', () => {
        const map = Methodius.getFrequencyMap(['he', 'el', 'll', 'll', 'lo']);
        const topGrams = Methodius.getTopGrams(map, 2);
        expect(topGrams.has('he')).toEqual(true);
        expect(topGrams.has('ll')).toEqual(true);
        expect(topGrams.has('lo')).toEqual(false);
        expect(topGrams.get('ll')).toEqual(2);
      });
    });
  });
  describe('instance properties', () => {
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
    it('has good values for the percentage properties', () => {});
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
  });
});