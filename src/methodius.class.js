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
  static punctuations = "\\.,;:!?‽¡¿⸘()\\[\\]{}<>’'«»…\"\n\t\r";

  /**
   * @property {string} wordSeparators - characters to ignore AND CONSUME when trying to find words
   * @description em-dash, period, comman, semicolon, colon, bang,
   * question mark, interrobang, Spanish bang+, parens, bracket, brace, single quote, space
   */
  static wordSeparators = '—\\.,;:!?‽¡¿⸘()\\[\\]{}<>«»…"\\s';

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
   * @description Gets average size of a word
   * @param {string[]} wordArray - text to be analyzed
   * @returns {number} - float. Average size of word
   */
  static getMeanWordSize(wordArray) {
    const filteredArray = wordArray.filter((word) => word.length > 0);
    const wordSizes = filteredArray.map((word) => word.trim().length);
    const sum = wordSizes.reduce(
      (accumulator, currentVal) => accumulator + currentVal,
      0,
    );
    const mean = sum / wordSizes.length;
    return mean;
  }

  /**
   * @description Gets median size of a word
   * @param {string[]} wordArray - text to be analyzed
   * @returns {number} - float. the median word size
   */
  static getMedianWordSize(wordArray) {
    const filteredArray = wordArray.filter((word) => word.length > 0);
    const wordSizes = filteredArray.map((word) => word.trim().length);
    const sortedSizes = wordSizes.sort((first, second) => {
      if (first < second) return -1;
      if (second > first) return 1;
      return 0;
    });
    const isOdd = sortedSizes.length % 2 !== 0;
    const median = isOdd
      ? sortedSizes[Math.floor(sortedSizes.length / 2)]
      : (sortedSizes[sortedSizes.length / 2]
          + sortedSizes[sortedSizes.length / 2 + 1])
        / 2;
    return median;
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
   * @param  {number} [limit=20] - number of top ngrams to return
   * @returns {Map<string, number>} - map of ngrams and their frequencies
   */
  static getTopGrams(frequencyMap, limit = 20) {
    const orderedGrams = [...frequencyMap].sort(
      (entry1, entry2) => entry2[1] - entry1[1],
    );

    const topGrams = orderedGrams.slice(0, limit);

    return new Map(topGrams);
  }

  /**
   * @description returns an array of items that occur in both iterables
   * @param  {Map|Array} iterable1 A map or array
   * @param  {Map|Array} iterable2 A map or array
   * @returns {Array<string>} An array of items that occur in both iterables. It will compare the keys, if sent a map
   */
  static getIntersection(iterable1, iterable2) {
    const array1 = Array.isArray(iterable1) ? iterable1 : [...iterable1.keys()];
    const array2 = Array.isArray(iterable2) ? iterable2 : [...iterable2.keys()];

    const intersection = [];

    array1.forEach((entry) => {
      if (array2.includes(entry) && !intersection.includes(entry)) {
        intersection.push(entry);
      }
    });

    return intersection;
  }

  /**
   * @description returns an array that is the union of two iterables
   * @param  {Map|Array} iterable1 A map or array
   * @param  {Map|Array} iterable2 A map or array
   * @returns {Array<string>} An array of items. It will  be the keys if sent a map
   */
  static getUnion(iterable1, iterable2) {
    const array1 = Array.isArray(iterable1) ? iterable1 : [...iterable1.keys()];
    const array2 = Array.isArray(iterable2) ? iterable2 : [...iterable2.keys()];
    const set = new Set();

    array1.forEach((char) => set.add(char));
    array2.forEach((char) => set.add(char));

    return [...set];
  }

  /**
   * @description returns an array of arrays of the unique items in either iterable
   * @param  {Map|Array} iterable1 A map or array
   * @param  {Map|Array} iterable2 A map or array
   * @returns {Array<Array>} An array of arrays of the unique items. The first item is the first parameter, 2nd item second param
   */
  static getDisjunctiveUnion(iterable1, iterable2) {
    const array1 = Array.isArray(iterable1) ? iterable1 : [...iterable1.keys()];
    const array2 = Array.isArray(iterable2) ? iterable2 : [...iterable2.keys()];

    const intersection = Methodius.getIntersection(array1, array2);
    const set1 = array1.filter((entry) => !intersection.includes(entry));
    const set2 = array2.filter((entry) => !intersection.includes(entry));

    return [set1, set2];
  }

  /**
   * @description returns a map containing various comparisons between two iterables
   * @param  {Map|Array} iterable1 an array or map
   * @param  {Map|Array} iterable2 an array or map
   * @returns {Map} A map containing various comparisons between two iterables
   */
  static getComparison(iterable1, iterable2) {
    return new Map([
      ['intersection', Methodius.getIntersection(iterable1, iterable2)],
      ['disjunctiveUnion', Methodius.getDisjunctiveUnion(iterable1, iterable2)],
    ]);
  }

  /**
   * @description determines the placement of a single ngram in an array of words
   * @param  {string} ngram - a unigram, bigram, trigram, or ngram
   * @param  {Array<string>} wordsArray - an array of words
   * @returns {Map<string, number>} - a map with the keys 'start', 'middle', and 'end'
   */
  static getWordPlacementForNGram(ngram, wordsArray) {
    const placementMap = new Map([
      ['start', 0],
      ['middle', 0],
      ['end', 0],
    ]);
    wordsArray.forEach((word) => {
      const wordNgrams = [...word.matchAll(new RegExp(ngram, 'gi'))];
      if (wordNgrams.length > 0) {
        wordNgrams.forEach((wordNgram) => {
          const ngramIndex = wordNgram.index;
          switch (ngramIndex) {
            case 0:
              placementMap.set('start', placementMap.get('start') + 1);
              break;
            case word.length - ngram.length:
              placementMap.set('end', placementMap.get('end') + 1);
              break;
            default:
              placementMap.set('middle', placementMap.get('middle') + 1);
              break;
          }
        });
      }
    });
    return placementMap;
  }

  /**
   * @description determines the placement of ngrams in an array of words
   * @param  {Array<string>} ngrams - an array of ngrams
   * @param  {Array<string>} wordsArray - an array of words
   * @returns {Map<string, Map<string, number>>} - a map with the key of the ngram, and the value that is a map containing start, middle, end
   */
  static getWordPlacementForNGrams(ngrams, wordsArray) {
    const wordPlacements = new Map();
    const uniqueNgrams = [...new Set(ngrams)];

    uniqueNgrams.forEach((ngram) => {
      wordPlacements.set(
        ngram,
        Methodius.getWordPlacementForNGram(ngram, wordsArray),
      );
    });

    return wordPlacements;
  }

  /**
   * @description gets ngrams from an array of words
   * @param {Array<string>} wordArray - an array of words
   * @param {number} [ngramSize=2] - the size of the ngrams to return
   * @returns {Array<Array<string>>} - an array containing arrays
   */
  static getNgramCollections(wordArray, ngramSize = 2) {
    const ngramCollections = [];

    wordArray.forEach((word) => {
      ngramCollections.push(Methodius.getNGrams(word, ngramSize));
    });
    return ngramCollections;
  }

  /**
   * @description using a collection returned from getNgramCollections, searches for a string and returns what comes before and after it
   * @param  {string} searchText - the string to search for
   * @param  {Array<string>|Array<Array<string>>} ngramCollections - an array of ngrams, or an nGramCollection
   * @param  {number} [siblingSize=1] - how many siblings to find in front or behind
   * @returns {Map<'before'|'after',Map<string, number>>} - a Map with the keys 'before' and 'after' which contain maps of what comes before and after
   * @example
   *    const words = ['revolution', 'nation'];
        const ngramCollections = Methodius.getNgramCollections(words, 2);
        const onSiblings = Methodius.getNgramSiblings('io', ngramCollections);
        onSiblings === new Map([
          ['before', new Map(
            ['ti', 2]
          )],
          ['after', new Map(
            ['on', 2]
          )]
        ])
   */
  static getNgramSiblings(searchText, ngramCollections, siblingSize = 1) {
    const ngramSiblings = new Map([
      ['before', new Map()],
      ['after', new Map()],
    ]);

    if (!searchText) return ngramSiblings;

    const collections = typeof ngramCollections[0] === 'string'
      ? [[...ngramCollections]]
      : ngramCollections;

    collections.forEach((ngramCollection) => {
      const ngramIndex = ngramCollection.indexOf(searchText);
      if (ngramIndex > -1) {
        const isFirst = ngramIndex === 0;
        const isLast = ngramIndex === ngramCollection.length - 1;
        const siblingsSliceStart = isFirst ? 0 : ngramIndex - siblingSize;
        const siblingsSliceEnd = isLast
          ? ngramCollection.length
          : ngramIndex + siblingSize + 1;
        const siblingsSlice = ngramCollection.slice(
          siblingsSliceStart,
          siblingsSliceEnd,
        );
        const siblingsSliceSearchIndex = siblingsSlice.indexOf(searchText);

        siblingsSlice.forEach((sibling, siblingIndex) => {
          if (siblingIndex === siblingsSliceSearchIndex) {
            return;
          }
          const siblingKey = siblingIndex < siblingsSliceSearchIndex ? 'before' : 'after';
          const hasSibling = ngramSiblings.get(siblingKey).has(sibling);
          if (!hasSibling) {
            ngramSiblings.get(siblingKey).set(sibling, 1);
          } else {
            ngramSiblings
              .get(siblingKey)
              .set(sibling, ngramSiblings.get(siblingKey).get(sibling) + 1);
          }
        });
      }
    });

    return ngramSiblings;
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
   * @description The average size of a word
   * @returns {number} float or int
   */
  get meanWordSize() {
    return Methodius.getMeanWordSize(this.words);
  }

  /**
   * @description The middle size of a word
   * @returns {number} float or int
   */
  get medianWordSize() {
    return Methodius.getMedianWordSize(this.words);
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
   * @description a map of placements of letters within words
   * @returns {Map<string, Map<string, number>>} - Map of letter placements in words
   */
  get letterPositions() {
    return Methodius.getWordPlacementForNGrams(this.uniqueLetters, this.words);
  }

  /**
   * @description a map of placements of bigrams within words
   * @returns {Map<string, Map<string, number>>} - Map of letter placements in words
   */
  get bigramPositions() {
    return Methodius.getWordPlacementForNGrams(this.uniqueBigrams, this.words);
  }

  /**
   * @description a map of placements of trigrams within words
   * @returns {Map<string, Map<string, number>>} - Map of letter placements in words
   */
  get trigramPositions() {
    return Methodius.getWordPlacementForNGrams(this.uniqueTrigrams, this.words);
  }

  /**
   * @description gets an array of customizeable ngrams in the text
   * @param {number} [size=2] - size of nGram
   * @returns {string[]} - array of granms in text
   */
  getLetterNGrams(size = 2) {
    return Methodius.getNGrams(this.sanitizedText, size);
  }

  /**
   * @description a map of the most used letters in the text
   * @param {number} [limit=20] - number of top letters to return
   * @returns {Map<string, number>} - map of letters and their frequencies
   */
  getTopLetters(limit = 10) {
    return Methodius.getTopGrams(this.letterFrequencies, limit);
  }

  /**
   * @description a map of the most used bigrams in the text
   * @param {number} [limit=20] - number of top bigrams to return
   * @returns {Map<string, number>} - map of bigrams and their frequencies
   */
  getTopBigrams(limit = 20) {
    return Methodius.getTopGrams(this.bigramFrequencies, limit);
  }

  /**
   * @description a map of the most used trigrams in the text
   * @param {number} [limit=20] - number of top trigrams to return
   * @returns {Map<string, number>} - map of trigrams and their frequencies
   */
  getTopTrigrams(limit = 20) {
    return Methodius.getTopGrams(this.trigramFrequencies, limit);
  }

  /**
   * @description a map of the most used words in the text
   * @param {number} [limit=20] - number of top trigrams to return
   * @returns {Map<string, number>} - map of trigrams and their frequencies
   */
  getTopWords(limit = 20) {
    return Methodius.getTopGrams(this.wordFrequencies, limit);
  }

  /**
   * @description Compare this methodius instance's letter, bigrams, trigrams, and words to another methodius instance
   * @param  {Methodius} methodius another methodius instance
   * @returns {Map<string, Map>} -A map of property names and their comparisons (intersection, disjunctiveUnions, etc) for a set of properties
   */
  compareTo(methodius) {
    if (!(methodius instanceof Methodius)) {
      throw new Error('This must be an instance of Methodius');
    }

    const comparison = new Map();

    comparison.set(
      'letters',
      Methodius.getComparison(this.letters, methodius.letters),
    );
    comparison.set(
      'bigrams',
      Methodius.getComparison(this.bigrams, methodius.bigrams),
    );
    comparison.set(
      'trigrams',
      Methodius.getComparison(this.trigrams, methodius.trigrams),
    );
    comparison.set(
      'words',
      Methodius.getComparison(this.words, methodius.words),
    );

    return comparison;
  }
}

module.exports = Methodius;
