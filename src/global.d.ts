export {};

declare global {
  /**  string meant to be used in a RegExp constructor */
  type RegexQuery = string;

  /** string without punctuations or word separators */
  type Word = string;

  /** a string of <N> adjacent characters from a Word  */
  type NGram = string;

  /** A user-friendly name for the size of the Ngram*/
  enum NGramType {
    "letter" = 1,
    "bigram" = 2,
    "trigram" = 3,
    "word" = Infinity,
  }

  /** an array of NGram extracted from a single word */
  type NGramSequence = NGram[];

  /** an array of NGramSequence extracted from many words */
  type NGramCollection = NGramSequence[];

  /** an array of <N> adjacent words from a text */
  type WordNGram = Word[];

  /** a map of ngrams and their frequencies as either an integer or percentage */
  type FrequencyMap = Map<NGram, number>;

  /** The positions within a word where an ngram can occur */
  type Positions = "start" | "middle" | "end";

  /** Frequency of placements of a single ngram in a word */
  type PlacementMap = Map<Positions, number>;

  /** Frequency of placements of many ngrams within words */
  type PlacementsMap = Map<NGram, PlacementMap>;

  /** The relative positions one NGram can have to another */
  type RelativePosition = "before" | "after";

  /** The frequency of a given relative position that <Ngram> has had to <NGram> */
  type SiblingsFrequencyMap = Map<RelativePosition, FrequencyMap>;
}
