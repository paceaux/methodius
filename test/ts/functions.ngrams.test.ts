import { describe, expect, it } from '@jest/globals';
import {
  getNGrams,
  getWordNGrams,
} from '../../src/functions.ngrams';

describe("getNGrams", () => {
  it("will get a default size of 2 ", () => {
    expect(getNGrams("hello world")).toEqual([
      "he",
      "el",
      "ll",
      "lo",
      "wo",
      "or",
      "rl",
      "ld",
    ]);
    expect(getNGrams("hello,world")).toEqual([
      "he",
      "el",
      "ll",
      "lo",
      "wo",
      "or",
      "rl",
      "ld",
    ]);
    expect(getNGrams("hello.world")).toEqual([
      "he",
      "el",
      "ll",
      "lo",
      "wo",
      "or",
      "rl",
      "ld",
    ]);
    expect(getNGrams("hello.(world)")).toEqual([
      "he",
      "el",
      "ll",
      "lo",
      "wo",
      "or",
      "rl",
      "ld",
    ]);
  });
  it("will get a size of 3 ", () => {
    expect(getNGrams("hello world", 3)).toEqual([
      "hel",
      "ell",
      "llo",
      "wor",
      "orl",
      "rld",
    ]);
    expect(getNGrams("hello,world", 3)).toEqual([
      "hel",
      "ell",
      "llo",
      "wor",
      "orl",
      "rld",
    ]);
    expect(getNGrams("hello.world", 3)).toEqual([
      "hel",
      "ell",
      "llo",
      "wor",
      "orl",
      "rld",
    ]);
  });
});
describe("getWordNGrams", () => {
  it("will get a default size of 2 ", () => {
    expect(getWordNGrams("hello world")).toEqual([
      ["hello", "world"],
    ]);
    expect(getWordNGrams("hello,world")).toEqual([
      ["hello", "world"],
    ]);
    expect(getWordNGrams("hello.world")).toEqual([
      ["hello", "world"],
    ]);
    expect(getWordNGrams("hello.(world)")).toEqual([
      ["hello", "world"],
    ]);
  });
  it("will get a size of 3 ", () => {
    expect(
      getWordNGrams("hello there world. How are You", 3)
    ).toEqual([
      ["hello", "there", "world"],
      ["there", "world", "How"],
      ["world", "How", "are"],
      ["How", "are", "You"],
    ]);
  });
});
