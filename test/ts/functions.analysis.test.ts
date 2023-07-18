import { describe, expect, it } from '@jest/globals';
import {
  getWordPlacementForNGram,
  getWordPlacementForNGrams,
  getNgramCollections,
  getNgramSiblings,
  getNgramTree,
} from '../../src/functions.analysis';

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
  it('returns an array from a 2-letter word', () =>{
    const tree = getNgramTree('on');
    console.log(tree);
    expect(tree.includes('o') ).toEqual(true);
    expect(tree.includes('n')).toEqual(true);
  });
  it('forms a tree from a 3-letter word', () =>{
    const tree = getNgramTree('one');
    expect(tree.has('on')).toEqual(true);
    expect(tree.has('ne')).toEqual(true);
  });
  it('forms a tree from a 4-letter word', () =>{
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
