/** string without punctuations or word separators */
type Word = string;

/** a string of <N> adjacent characters from a Word  */
type NGram = string;

/** an array of NGram extracted from a single word */
type NGramSequence = NGram[];

/** an array of NGramSequence extracted from many words */
type NGramCollection = NGramSequence[];

/** an array of <N> adjacent words from a text */
type WordNGram = Word[];

export {
  Word,
  NGramSequence,
  NGram,
  NGramCollection,
  WordNGram,
};
