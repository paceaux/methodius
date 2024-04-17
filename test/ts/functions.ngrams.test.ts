import { describe, expect, it } from '@jest/globals';
import {
  getNGrams,
  getWordNGrams,
} from '../../src/functions.ngrams';

describe('getNGrams', () => {
  it('will get a default size of 2 ', () => {
    expect(getNGrams('hello world')).toEqual([
      'he',
      'el',
      'll',
      'lo',
      'wo',
      'or',
      'rl',
      'ld',
    ]);
    expect(getNGrams('hello,world')).toEqual([
      'he',
      'el',
      'll',
      'lo',
      'wo',
      'or',
      'rl',
      'ld',
    ]);
    expect(getNGrams('hello.world')).toEqual([
      'he',
      'el',
      'll',
      'lo',
      'wo',
      'or',
      'rl',
      'ld',
    ]);
    expect(getNGrams('hello.(world)')).toEqual([
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
  it('will get a size of 3 ', () => {
    expect(getNGrams('hello world', 3)).toEqual([
      'hel',
      'ell',
      'llo',
      'wor',
      'orl',
      'rld',
    ]);
    expect(getNGrams('hello,world', 3)).toEqual([
      'hel',
      'ell',
      'llo',
      'wor',
      'orl',
      'rld',
    ]);
    expect(getNGrams('hello.world', 3)).toEqual([
      'hel',
      'ell',
      'llo',
      'wor',
      'orl',
      'rld',
    ]);
  });
  it('will not have any ngrams with non-letter non-numbers', () => {
    expect(getNGrams('foot-ball')).toEqual(['fo', 'oo', 'ot', 'ba', 'al', 'll']);
    expect(getNGrams('foot_ball', 3)).toEqual(['foo', 'oot', 'bal', 'all']);
    expect(getNGrams('foot-_ball')).toEqual(['fo', 'oo', 'ot', 'ba', 'al', 'll']);
    expect(getNGrams('foot-_ball_')).toEqual(['fo', 'oo', 'ot', 'ba', 'al', 'll']);
    expect(getNGrams('#football')).toEqual(['fo', 'oo', 'ot','tb', 'ba', 'al', 'll']);
    expect(getNGrams('footb@ll')).toEqual(['fo', 'oo', 'ot','tb', 'll']);
    expect(getNGrams('footb@11')).toEqual(['fo', 'oo', 'ot','tb', '11']);
  });
  it('will work on Hebrew', () => {
    expect(getNGrams('שלום')).toEqual(['של', 'לו', 'ום']);
  });
  it('will work on Ukrainian', () => {
    expect(getNGrams('привіт')).toEqual(['пр', 'ри', 'ив', 'ві', 'іт']);
  });
  it('will not get tripped up by quotes', () => {
    expect(getNGrams('hello "world"')).toEqual(['he', 'el', 'll', 'lo', 'wo', 'or', 'rl', 'ld']);
    expect(getNGrams('hello \'world\'')).toEqual(['he', 'el', 'll', 'lo', 'wo', 'or', 'rl', 'ld']);
    expect(getNGrams('hello “world”')).toEqual(['he', 'el', 'll', 'lo', 'wo', 'or', 'rl', 'ld']);
    expect(getNGrams('«hello world»')).toEqual(['he', 'el', 'll', 'lo', 'wo', 'or', 'rl', 'ld']);
  })
});
describe('getWordNGrams', () => {
  it('will get a default size of 2 ', () => {
    expect(getWordNGrams('hello world')).toEqual([
      ['hello', 'world'],
    ]);
    expect(getWordNGrams('hello,world')).toEqual([
      ['hello', 'world'],
    ]);
    expect(getWordNGrams('hello.world')).toEqual([
      ['hello', 'world'],
    ]);
    expect(getWordNGrams('hello.(world)')).toEqual([
      ['hello', 'world'],
    ]);
  });
  it('will get a size of 3 ', () => {
    expect(
      getWordNGrams('hello there world. How are You', 3),
    ).toEqual([
      ['hello', 'there', 'world'],
      ['there', 'world', 'How'],
      ['world', 'How', 'are'],
      ['How', 'are', 'You'],
    ]);
  });
});
