const Methodius = require('../src/methodius.class');

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
  describe('getNGramsInWords', () => {
    it('will get two arrays of ngrams from two words', () => {
      const words = ['revolution', 'nation'];
      const [array1, array2] = Methodius.getNgramCollections(words, 2);
      expect(array1).toEqual(['re', 'ev', 'vo', 'ol', 'lu', 'ut', 'ti', 'io', 'on']);
      expect(array2).toEqual(['na', 'at', 'ti', 'io', 'on']);
    });
  });
  describe('getNGramSiblings', () => {
    it('gets what comes before a given bigram', () => {
      const words = ['revolution', 'nation'];
      const ngramCollections = Methodius.getNgramCollections(words, 2);
      const onSiblings = Methodius.getNgramSiblings('on', ngramCollections);
      expect(onSiblings.has('before')).toEqual(true);
      expect(onSiblings.has('after')).toEqual(true);
      expect(onSiblings.get('before').get('io')).toEqual(2);
    });
    it('gets what comes after a given bigram', () => {
      const words = ['revolution', 'nation'];
      const ngramCollections = Methodius.getNgramCollections(words, 2);
      const onSiblings = Methodius.getNgramSiblings('io', ngramCollections);
      expect(onSiblings.has('before')).toEqual(true);
      expect(onSiblings.has('after')).toEqual(true);
      expect(onSiblings.get('after').get('on')).toEqual(2);
    });
    it('can be sent a single array', () => {
      const onSiblings = Methodius.getNgramSiblings('io', ['na', 'at', 'ti', 'io', 'on']);
      expect(onSiblings.has('before')).toEqual(true);
      expect(onSiblings.has('after')).toEqual(true);
      expect(onSiblings.get('after').get('on')).toEqual(1);
      expect(onSiblings.get('before').get('ti')).toEqual(1);
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

        const intersection = Methodius.getIntersection(map1, map2);
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

        const intersection = Methodius.getIntersection(map1, map2);
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

        const intersection = Methodius.getIntersection(map1, map2);
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

        const [set1, set2] = Methodius.getDisjunctiveUnion(map1, map2);
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

        const [set1, set2] = Methodius.getDisjunctiveUnion(map1, map2);
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

        const [set1, set2] = Methodius.getDisjunctiveUnion(map1, map2);
        expect(set1).toEqual(map1);
        expect(set2).toEqual(map2);
      });
    });
  });
  describe('getUnion', () => {
    it('turns tio and ion into tion', () => {
      const union = Methodius.getUnion([...'tio'], [...'ion']);
      const result = union.join('');
      expect(result).toEqual('tion');
    });
    it('turns io and on into ion', () => {
      const union = Methodius.getUnion([...'io'], [...'on']);
      const result = union.join('');
      expect(result).toEqual('ion');
    });
    it('turns on and it into onit', () => {
      const union = Methodius.getUnion([...'on'], [...'it']);
      const result = union.join('');
      expect(result).toEqual('onit');
    });
    it('turns on and io into oni', () => {
      const union = Methodius.getUnion([...'on'], [...'i']);
      const result = union.join('');
      expect(result).toEqual('oni');
    });
  });
  describe('placements', () => {
    it('gets a placement map for an ngram', () => {
      const words = ['he', 'therefore', 'ran', 'after', 'the', 'cat', 'who', 'ran', 'after', 'the', 'dog'];
      const ngram = 'he';

      const placementMap = Methodius.getWordPlacementForNGram(ngram, words);

      expect(placementMap.get('start')).toEqual(1);
      expect(placementMap.get('middle')).toEqual(1);
      expect(placementMap.get('end')).toEqual(2);
    });
    it('gets a placement map for another ngram', () => {
      const words = ['he', 'therefore', 'ran', 'after', 'the', 'cat', 'who', 'ran', 'after', 'the', 'dog'];
      const ngram = 're';

      const placementMap = Methodius.getWordPlacementForNGram(ngram, words);

      expect(placementMap.get('start')).toEqual(0);
      expect(placementMap.get('middle')).toEqual(1);
      expect(placementMap.get('end')).toEqual(1);
    });
    it('gets a placement map for yet another ngram', () => {
      const words = ['he', 'therefore', 'ran', 'after', 'the', 'cat', 'who', 'ran', 'after', 'the', 'dog'];
      const ngram = 'er';

      const placementMap = Methodius.getWordPlacementForNGram(ngram, words);

      expect(placementMap.get('start')).toEqual(0);
      expect(placementMap.get('middle')).toEqual(1);
      expect(placementMap.get('end')).toEqual(2);
    });
    it('gets placements for ngrams', () => {
      const words = ['he', 'therefore', 'ran', 'after', 'the', 'cat', 'who', 'ran', 'after', 'the', 'dog'];
      const ngram = ['he', 're', 'er'];

      const placementMap = Methodius.getWordPlacementForNGrams(ngram, words);
      expect(placementMap.get('he').get('start')).toEqual(1);
      expect(placementMap.get('he').get('middle')).toEqual(1);
      expect(placementMap.get('re').get('start')).toEqual(0);
      expect(placementMap.get('re').get('end')).toEqual(1);
      expect(placementMap.get('er').get('start')).toEqual(0);
      expect(placementMap.get('er').get('middle')).toEqual(1);
      expect(placementMap.get('er').get('end')).toEqual(2);
    });
  });
  describe('wordSize', () => {
    it('will get the mean word size from an array of words', () => {
      const words = ['it', 'will', 'get', 'the', 'mean'];
      const mean = Methodius.getMeanWordSize(words);
      expect(mean).toEqual((2 + 4 + 3 + 3 + 4) / 5);
    });
    it('will get the median word size from an odd sized array of words', () => {
      const words = ['it', 'will', 'get', 'the', 'mean'];
      const mean = Methodius.getMedianWordSize(words);
      expect(mean).toEqual(3);
    });
    it('will get the median word size from an even sized array of words', () => {
      const words = ['it', 'will', 'get', 'the'];
      const mean = Methodius.getMedianWordSize(words);
      expect(mean).toEqual(3.5);
    });
  });
});
