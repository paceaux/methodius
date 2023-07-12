import { describe, expect, it } from '@jest/globals';
import {
  hasPunctuation,
  hasSpace,
  sanitizeText,
  getWords,
} from '../../src/functions.tokenizers';

describe('tokenization', () => {
  it('can determine if a bit of text has common punctuations', () => {
    expect(hasPunctuation('hello, world!')).toBe(true);
    expect(hasPunctuation('hello world')).toBe(false);
    expect(hasPunctuation('"hello" world')).toBe(true);
    expect(hasPunctuation('hello')).toBe(false);
    expect(hasPunctuation('Don\'t shouldn\'t')).toBe(true);
  });
  it('can determine if a bit of text has spaces', () => {
    expect(hasSpace('hello world')).toBe(true);
    expect(hasSpace('hello')).toBe(false);
    expect(hasSpace('hello world')).toBe(true);
    expect(hasSpace('hello world')).toBe(true);
    expect(hasSpace('hello world')).toBe(true);
    expect(hasSpace('hello world')).toBe(true);
  });
  it('can normalize and sanitize Hebrew Text', () => {
    expect(sanitizeText('תְּהִלִּים')).toEqual('תהלים');
  });
  it('can normalize and sanitize Latin text', () => {
    expect(sanitizeText('Hello World')).toEqual('hello world');
    expect(sanitizeText('Héllö ñ Wòrld')).toEqual('hello n world');
  });
  it('can get words from a string', () => {
    expect(getWords('hello world')).toEqual(['hello', 'world']);
    expect(getWords('hello,world')).toEqual(['hello', 'world']);
    expect(getWords('hello, world')).toEqual(['hello', 'world']);
    expect(getWords('hello world there')).toEqual(['hello', 'world', 'there']);
  });
});
