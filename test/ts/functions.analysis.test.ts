import { describe, expect, it } from '@jest/globals';
import {
  getWordPlacementForNGram,
  getWordPlacementForNGrams,
  getNgramCollections,
  getNgramSiblings,
  getNgramTree,
  getNgramTreeCollection,
  getRelatedNgrams,
} from '../../src/functions.analysis';
import {
  getNGrams,
} from '../../src/functions.ngrams';
import {
  getFrequencyMap,
  getTopGrams,
} from '../../src/functions.metrics.ngrams';

describe('getNGramsInWords', () => {
  it('will get two arrays of ngrams from two words', () => {
    const words = ['revolution', 'nation'];
    const [array1, array2] = getNgramCollections(words, 2);
    expect(array1).toEqual(['re', 'ev', 'vo', 'ol', 'lu', 'ut', 'ti', 'io', 'on']);
    expect(array2).toEqual(['na', 'at', 'ti', 'io', 'on']);
  });
});
describe('getNGramSiblings', () => {
  it('gets what comes before a given bigram', () => {
    const words = ['revolution', 'nation'];
    const ngramCollections = getNgramCollections(words, 2);
    const onSiblings = getNgramSiblings('on', ngramCollections);
    expect(onSiblings.has('before')).toEqual(true);
    expect(onSiblings.has('after')).toEqual(true);
    expect(onSiblings.get('before').get('io')).toEqual(2);
  });
  it('gets what comes after a given bigram', () => {
    const words = ['revolution', 'nation'];
    const ngramCollections = getNgramCollections(words, 2);
    const onSiblings = getNgramSiblings('io', ngramCollections);
    expect(onSiblings.has('before')).toEqual(true);
    expect(onSiblings.has('after')).toEqual(true);
    expect(onSiblings.get('after').get('on')).toEqual(2);
  });
  it('can be sent a single array', () => {
    const onSiblings = getNgramSiblings('io', ['na', 'at', 'ti', 'io', 'on']);
    expect(onSiblings.has('before')).toEqual(true);
    expect(onSiblings.has('after')).toEqual(true);
    expect(onSiblings.get('after').get('on')).toEqual(1);
    expect(onSiblings.get('before').get('ti')).toEqual(1);
  });
});

describe('placements', () => {
  it('gets a placement map for an ngram', () => {
    const words = ['he', 'therefore', 'ran', 'after', 'the', 'cat', 'who', 'ran', 'after', 'the', 'dog'];
    const ngram = 'he';

    const placementMap = getWordPlacementForNGram(ngram, words);

    expect(placementMap.get('start')).toEqual(1);
    expect(placementMap.get('middle')).toEqual(1);
    expect(placementMap.get('end')).toEqual(2);
  });
  it('gets a placement map for another ngram', () => {
    const words = ['he', 'therefore', 'ran', 'after', 'the', 'cat', 'who', 'ran', 'after', 'the', 'dog'];
    const ngram = 're';

    const placementMap = getWordPlacementForNGram(ngram, words);

    expect(placementMap.get('start')).toEqual(0);
    expect(placementMap.get('middle')).toEqual(1);
    expect(placementMap.get('end')).toEqual(1);
  });
  it('gets a placement map for yet another ngram', () => {
    const words = ['he', 'therefore', 'ran', 'after', 'the', 'cat', 'who', 'ran', 'after', 'the', 'dog'];
    const ngram = 'er';

    const placementMap = getWordPlacementForNGram(ngram, words);

    expect(placementMap.get('start')).toEqual(0);
    expect(placementMap.get('middle')).toEqual(1);
    expect(placementMap.get('end')).toEqual(2);
  });
  it('gets placements for ngrams', () => {
    const words = ['he', 'therefore', 'ran', 'after', 'the', 'cat', 'who', 'ran', 'after', 'the', 'dog'];
    const ngram = ['he', 're', 'er'];

    const placementMap = getWordPlacementForNGrams(ngram, words);
    expect(placementMap.get('he').get('start')).toEqual(1);
    expect(placementMap.get('he').get('middle')).toEqual(1);
    expect(placementMap.get('re').get('start')).toEqual(0);
    expect(placementMap.get('re').get('end')).toEqual(1);
    expect(placementMap.get('er').get('start')).toEqual(0);
    expect(placementMap.get('er').get('middle')).toEqual(1);
    expect(placementMap.get('er').get('end')).toEqual(2);
  });
});

describe('getNGramTree', () => {
  it('returns an array from a 2-letter word', () => {
    const tree = getNgramTree('on');
    expect(tree.includes('o')).toEqual(true);
    expect(tree.includes('n')).toEqual(true);
  });
  it('forms a tree from a 3-letter word', () => {
    const tree = getNgramTree('one');
    expect(tree.has('on')).toEqual(true);
    expect(tree.has('ne')).toEqual(true);
  });
  it('forms a tree from a 4-letter word', () => {
    const tree = getNgramTree('tree');
    expect(tree.has('tre')).toEqual(true);
    expect(tree.has('ree')).toEqual(true);
    expect(tree.get('tre').has('tr')).toEqual(true);
    expect(tree.get('tre').has('re')).toEqual(true);
  });
  it('forms a tree from a 6-letter word', () => {
    const tree = getNgramTree('nation');
    expect(tree.has('natio')).toEqual(true);
    expect(tree.has('ation')).toEqual(true);
    expect(tree.get('ation').has('atio')).toEqual(true);
    expect(tree.get('ation').has('tion')).toEqual(true);
    expect(tree.get('ation').get('tion').has('tio')).toEqual(true);
    expect(tree.get('ation').get('tion').has('ion')).toEqual(true);
    expect(tree.get('ation').get('tion').get('ion').has('io')).toEqual(true);
    expect(tree.get('ation').get('tion').get('ion').has('on')).toEqual(true);
  });
});

describe('getNgramTreeCollection', () => {
  it('forms a map of trees from an array of words', () => {
    const words = ['the', 'revolution', 'nation', 'distillation'];
    const treeCollection = getNgramTreeCollection(words);
    expect(treeCollection.has('the')).toEqual(true);
    expect(treeCollection.has('revolution')).toEqual(true);
    expect(treeCollection.has('nation')).toEqual(true);
    expect(treeCollection.has('distillation')).toEqual(true);
  });
  it('will not have duplicates', () => {
    const words = ['the', 'revolution', 'nation', 'distillation'];
    const treeCollection = getNgramTreeCollection(words);
    expect(treeCollection.has('the')).toEqual(true);
    expect(treeCollection.has('revolution')).toEqual(true);
    expect(treeCollection.has('nation')).toEqual(true);
    expect(treeCollection.has('distillation')).toEqual(true);
  });
});

/* eslint-disable max-len */
describe('getRelatedNgrams', () => {
  it('will discover bigram combos', () => {
    const ngrams = getNGrams('the revolution of the nation was on television. It was about pollution and the terrible situation ', 2);
    const frequencyMap = getFrequencyMap(ngrams);
    const topNgrams = getTopGrams(frequencyMap, 5);
    const words = ['the', 'revolution', 'of', 'the', 'nation', 'was', 'on', 'television', 'it', 'was', 'about', 'pollution', 'and', 'the', 'terrible', 'situation'];
    const relatedNgrams = getRelatedNgrams(words, topNgrams, 2, 5);
    expect(relatedNgrams).toBeTruthy();
    expect(relatedNgrams.has('io')).toBe(true);
    expect(relatedNgrams.has('on')).toBe(true);
    expect(relatedNgrams.get('io')).toBe(5);
    expect(relatedNgrams.get('on')).toBe(5);
  });
  it('will discover more bigram combos', () => {
    const ngrams = getNGrams('they saw this thing and this these thimbles thoughtfully throwing thorns through the thicket they thusly thought wrath');
    const frequencyMap = getFrequencyMap(ngrams);
    const topNgrams = getTopGrams(frequencyMap, 7);
    const words = ['they', 'saw', 'this', 'thing', 'and', 'this', 'these', 'thimbles', 'thoughtfully', 'throwing', 'thorns', 'through', 'the', 'thicket', 'they', 'thusly', 'thought', 'wrath'];
    const relatedNgrams = getRelatedNgrams(words, topNgrams, 2, 7);
    expect(relatedNgrams).toBeTruthy();
    expect(relatedNgrams.has('th')).toBe(true);
    expect(relatedNgrams.has('he')).toBe(true);
    expect(relatedNgrams.has('hi')).toBe(true);
    expect(relatedNgrams.get('th')).toBe(12);
    expect(relatedNgrams.get('he')).toBe(4);
    expect(relatedNgrams.get('hi')).toBe(5);
  });
  it('will discover trigram combos of tio / ion and ignore statistically insignificant instances', () => {
    const ngrams = getNGrams('the revolution of the nation was on television. It was about pollution and the terrible situation', 3);
    const frequencyMap = getFrequencyMap(ngrams);
    const topNgrams = getTopGrams(frequencyMap, 5);
    const words = ['the', 'revolution', 'of', 'the', 'nation', 'was', 'on', 'television', 'it', 'was', 'about', 'pollution', 'and', 'the', 'terrible', 'situation'];
    const relatedNgrams = getRelatedNgrams(words, topNgrams, 3, 5);
    expect(relatedNgrams).toBeTruthy();
    expect(relatedNgrams.has('ion')).toBe(true);
    expect(relatedNgrams.has('tio')).toBe(true);
    expect(relatedNgrams.get('ion')).toBe(4); // it won't see the 'ion' in 'television' as significant
    expect(relatedNgrams.get('tio')).toBe(4);
  });
  it('will discover trigram combos of tio / ion and find sio instances', () => {
    const ngrams = getNGrams('the revolution of the nation was on television. It was about pollution and the terrible situation of decisions about derision', 3);
    const frequencyMap = getFrequencyMap(ngrams);
    const topNgrams = getTopGrams(frequencyMap, 5);
    const words = ['the', 'revolution', 'of', 'the', 'nation', 'was', 'on', 'television', 'it', 'was', 'about', 'pollution', 'and', 'the', 'terrible', 'situation', 'of', 'decisions', 'about', 'derision'];
    const relatedNgrams = getRelatedNgrams(words, topNgrams, 3, 5);
    expect(relatedNgrams).toBeTruthy();
    expect(relatedNgrams.has('ion')).toBe(true);
    expect(relatedNgrams.has('tio')).toBe(true);
    expect(relatedNgrams.has('sio')).toBe(true);
    expect(relatedNgrams.get('ion')).toBe(7); // b/c if finds sio significant, it finds the ion after it significant
    expect(relatedNgrams.get('tio')).toBe(4);
    expect(relatedNgrams.get('sio')).toBe(3);
  });
});
/* eslint-enable max-len */
