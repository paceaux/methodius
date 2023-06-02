export {};

declare global {
  /**  string meant to be used in a RegExp constructor */
  type RegexQuery = string; 

  /** string without punctuations or word separators */
  type Word = string; 

  /** a string of <N> adjacent characters from a Word  */
  type NGram = string;

  /** an array of <N> adjacent words from a text */
  type WordNGram = Word[];

  /** a map of ngrams and their frequencies as either an integer or percentage */
  type FrequencyMap = Map<NGram, number>;
}
