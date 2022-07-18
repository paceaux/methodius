class Methodius {
  /**
   * @param  {string} text raw text to be analyzed
   */
  constructor(text) {
    this.text = text;
  }

  /**
   * @property {string} punctuations - characters to ignore when analyzing text
   * @description period, comma, semicolon, colon, bang,
   * question mark, interrobang, Spanish bang+, parens, bracket, brace, single quote, some spaces
   */
  static punctuations = "\\.,;:!?‽¡¿⸘()\\[\\]{}<>’'…\"\n\t\r";

  /**
   * @property {string} wordSeparators - characters to ignore AND CONSUME when trying to find words
   * @description em-dash, period, comman, semicolon, colon, bang,
   * question mark, interrobang, Spanish bang+, parens, bracket, brace, single quote, space
   */
  static wordSeparators = '—\\.,;:!?‽¡¿⸘()\\[\\]{}<>…"\\s';

  /**
   * @description determins if string contains punctuation
   * @param  {string} string - string to check for punctuation
   * @returns {boolean} - true if string contains punctuation
   */
  static hasPunctuation(string) {
    const punctuationRegEx = new RegExp(`([${Methodius.punctuations}])`, 'g');

    return punctuationRegEx.test(string);
  }

  /**
   * @description determins if a string has a space
   * @param  {string} string - string to check for space
   * @returns  {boolean} - true if string contains space
   */
  static hasSpace(string) {
    return string.search(/\s/) !== -1;
  }

  /**
   * @description lowercases text and removes diacritics and other characters that would throw off n-gram analysis
   * @param  {string} string - string to sanitize
   * @returns {string} - string that is all lowercase and without Hebrew diacritics
   */
  static sanitizeText(string) {
    const stringWithoutDiacritics = string
      .replace(/\u05BE/g, '-')
      .replace(/[\u0591-\u05C7]/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return stringWithoutDiacritics.toLowerCase();
  }

  /**
   * @description extracts an array of words from a string
   * @param {string} text - text to be analyzed
   * @returns {string[]} - array of words in text
   */
  static getWords(text) {
    const wordSeparatorRegex = new RegExp(
      `[(${Methodius.wordSeparators})]`,
      'g',
    );
    const wordArray = text
      .split(wordSeparatorRegex)
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    return wordArray;
  }

  /**
   * @description gets ngrams from text
   * @param  {string} text - text to be analyzed
   * @param  {number} [gramSize=2] - size of ngram to be analyzed
   * @returns {string[]} - array of ngrams
   */
  static getNGrams(text, gramSize = 2) {
    const bigrams = [];
    for (let i = 0; i < text.length - (gramSize - 1); i += 1) {
      const substring = text.substring(i, i + gramSize);

      if (
        !Methodius.hasPunctuation(substring)
        && !Methodius.hasSpace(substring)
      ) {
        bigrams.push(substring);
      }
    }
    return bigrams;
  }

  /**
   * @param {string} text - text to be analyzed
   * @param {number} [gramSize=2] - size of ngram to be analyzed
   * @returns {string[]} - array of words
   * @description - This doesn't use sentence punctuation as a boundary. Should it?
   * @example
   *   getWordNGrams("Hello world. how are you?", 3) would return [[hello, world, how], [world, how, are], [how, are, you]]
   */
  static getWordNGrams(text, gramSize = 2) {
    const words = Methodius.getWords(text);
    const wordNGrams = [];
    for (let i = 0; i < words.length - (gramSize - 1); i += 1) {
      const substring = words.slice(i, i + gramSize);
      wordNGrams.push(substring);
    }
    return wordNGrams;
  }

  /**
   * @description converts an array of strings into a map of those strings and number of occurences
   * @param  {string[]} ngramArray - array of ngrams
   * @returns {Map<string, number>} - map of ngrams and their frequencies
   */
  static getFrequencyMap(ngramArray) {
    const frequencies = new Map();
    ngramArray.forEach((ngram) => {
      if (frequencies.has(ngram)) {
        frequencies.set(ngram, frequencies.get(ngram) + 1);
      } else {
        frequencies.set(ngram, 1);
      }
    });
    return frequencies;
  }

  /**
   * @description converts a frequency map into a map of percentages
   * @param  {Map<string, number>} frequencyMap - map of ngrams and their frequencies
   * @returns {Map<string, number>} - map of ngrams and their percentages
   */
  static getPercentMap(frequencyMap) {
    const percentMap = new Map();
    frequencyMap.forEach((value, key) => {
      percentMap.set(key, value / frequencyMap.size);
    });
    return percentMap;
  }

  /**
   * @description filters a frequency map into only a small subset of the most frequent ones
   * @param  {Map<string, number>} frequencyMap - map of ngrams and their frequencies
   * @param  {number} [topCount=20] - number of top ngrams to return
   * @returns {Map<string, number>} - map of ngrams and their frequencies
   */
  static getTopGrams(frequencyMap, topCount = 20) {
    const orderedGrams = [...frequencyMap].sort((entry1, entry2) => entry2[1] - entry1[1]);

    const topGrams = orderedGrams.slice(0, topCount);

    return new Map(topGrams);
  }

  /**
   * @description lowercased text with diacritics removed
   * @returns  {string} sanitizedText - text that is all lowercase and without Hebrew diacritics
   */
  get sanitizedText() {
    return Methodius.sanitizeText(this.text);
  }

  /**
   * @description an array of letters in the text
   * @returns {string[]} - array of letters in text
   */
  get letters() {
    return Methodius.getNGrams(this.sanitizedText, 1);
  }

  /**
   * @description an array of words in the text
   * @returns {string[]} - array of words in text
   */
  get words() {
    return Methodius.getWords(this.sanitizedText);
  }

  /**
   * @description an array of letter bigrams in the text
   * @returns {string[]} - array of bigrams in text
   */
  get bigrams() {
    return Methodius.getNGrams(this.sanitizedText, 2);
  }

  /**
   * @description an array of letter trigrams in the text
   * @returns {string[]} - array of trigrams in text
   */
  get trigrams() {
    return Methodius.getNGrams(this.sanitizedText, 3);
  }

  /**
   * @description an array of unique letters in the text
   * @returns {string[]} - array of unique letters in text
   */
  get uniqueLetters() {
    return [...new Set(this.letters)];
  }

  /**
   * @description an array of unique bigrams in the text
   * @returns {string[]} - array of unique bigrams in text
   */
  get uniqueBigrams() {
    return [...new Set(this.bigrams)];
  }

  /**
   * @description an array of unique trigrams in the text
   * @returns {string[]} - array of unique trigrams in text
   */
  get uniqueTrigrams() {
    return [...new Set(this.trigrams)];
  }

  /**
   * @description an array of unique words in the text
   * @returns {string[]} - array of unique words in text
   */
  get uniqueWords() {
    return [...new Set(this.words)];
  }

  /**
   * @description a map of letter frequencies in the sanitized text
   * @returns {Map<string, number>} - map of unique letters in text
   */
  get letterFrequencies() {
    return Methodius.getFrequencyMap(this.letters);
  }

  /**
   * @description a map of bigram frequencies in the sanitized text
   * @returns {Map<string, number>} - map of bigram frequencies in text
   */
  get bigramFrequencies() {
    return Methodius.getFrequencyMap(this.bigrams);
  }

  /**
   * @description a map of trigram frequencies in the sanitized text
   * @returns {Map<string, number>} - map of trigram frequencies in text
   */
  get trigramFrequencies() {
    return Methodius.getFrequencyMap(this.trigrams);
  }

  /**
   * @description a map of word frequencies in the sanitized text
   * @returns {Map<string, number>} - map of unique words in text
   */
  get wordFrequencies() {
    return Methodius.getFrequencyMap(this.words);
  }

  /**
   * @description a map of letter percentages in the sanitized text
   * @returns {Map<string, number>} - Map of letter frequencies as percentage in text
   */
  get letterPercentages() {
    return Methodius.getPercentMap(this.letterFrequencies);
  }

  /**
   * @description a map of bigram frequencies as percentage in the sanitized text
   * @returns {Map<string, number>} - Map of bigram frequencies as percentage in text
   */
  get bigramPercentages() {
    return Methodius.getPercentMap(this.bigramFrequencies);
  }

  /**
   * @description a map of the most used trigrams in the text, as a percent
   * @returns {Map<string, number>} - Map of trigram frequencies as percentage in text
   */
  get trigramPercentages() {
    return Methodius.getPercentMap(this.trigramFrequencies);
  }

  /**
   * @description a map of the most used letters in the text
   * @param {number} [topCount=20] - number of top letters to return
   * @returns {Map<string, number>} - map of letters and their frequencies
   */
  getTopLetters(topCount = 10) {
    return Methodius.getTopGrams(this.letterFrequencies, topCount);
  }

  /**
   * @description a map of the most used bigrams in the text
   * @param {number} [topCount=20] - number of top bigrams to return
   * @returns {Map<string, number>} - map of bigrams and their frequencies
   */
  getTopBigrams(topCount = 20) {
    return Methodius.getTopGrams(this.bigramFrequencies, topCount);
  }

  /**
   * @description a map of the most used trigrams in the text
   * @param {number} [topCount=20] - number of top trigrams to return
   * @returns {Map<string, number>} - map of trigrams and their frequencies
   */
  getTopTrigrams(topCount = 20) {
    return Methodius.getTopGrams(this.trigramFrequencies, topCount);
  }

  /**
   * @description a map of the most used words in the text
   * @param {number} [topCount=20] - number of top trigrams to return
   * @returns {Map<string, number>} - map of trigrams and their frequencies
   */
  getTopWords(topCount = 20) {
    return Methodius.getTopGrams(this.wordFrequencies, topCount);
  }
}

module.exports = Methodius;
