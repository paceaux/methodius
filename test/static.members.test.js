const Methodius = require('../src/methodius.class');

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
  it('has all the common punctuations', () => {
    expect(Methodius.punctuations).toEqual(
      "\\.,;:!?‽¡¿⸘()\\[\\]{}<>’'«»…\"\n\t\r",
    );
  });
  it('has common word Separators', () => {
    expect(Methodius.wordSeparators).toEqual('—\\.,;:!?‽¡¿⸘()\\[\\]{}<>«»…"\\s');
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
