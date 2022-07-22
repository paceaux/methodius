# Methodius (an NGram utility)

A utility for analyzing text on the web. 

supply a bit o' text to the methodius class, and let it determine your bigrams, trigrams, ngrams, letter-frequencies, and word frequencies



## Example

```JavaScript
const { Methodius } = require('../index');

const udhr1 = `
All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.
`;
const nGrams = new Methodius(udhr1);

const topLetters = nGrams.getTopLetters(10);
const topWords = nGrams.getTopWords(10);

```

# API

## `Methodius`
Global Class

`new Methodius(text)`

**Parameters**
| name      | type  | Description   |
| ---       |---    | ---           |
| text    | string       |     raw text to be analyzed          |

### Static Members
#### `Punctuations`
characters to ignore when analyzing text
period, comma, semicolon, colon, bang, question mark, interrobang, Spanish bang+, parens, bracket, brace, single quote, some spaces

`\\.,;:!?‽¡¿⸘()\\[\\]{}<>’'…\"\n\t\r`

#### `wordSeparators`
characters to ignore AND CONSUME when trying to find words
em-dash, period, comma, semicolon, colon, bang, question mark, interrobang, Spanish bang+, parens, bracket, brace, single quote, space

`—\\.,;:!?‽¡¿⸘()\\[\\]{}<>…"\\s`


### Static Methods
#### `hasPunctuation(string)`
 determines if string contains punctuation 
 
**Parameters**
| name      | type  | Description   |
| ---       |---    | ---           |
| string    | string       |               |

**Returns**
`boolean`

#### `hasSpace(string)`
 determines if a string has a space 

**Parameters**
| name  | type  | Description   |
| ---           |---        | ---           |
| string        | string    |                |

**Returns**
`boolean`

#### `sanitizeText(string)`
 lowercases text and removes diacritics and other characters that would throw off n-gram analysis 

**Parameters**
| name  | type  | Description   |
| ---           |---    | ---           |
| string        |string       |               |

**Returns**
`string`

#### `getWords(text)`
 extracts an array of words from a string 

**Parameters**
| name  | type  | Description   |
| ---       |---    | ---           |
| text      | string       |               |

**Returns**
`Array<string>`

#### `getNGrams(text, gramSize)`
 gets ngrams from text 

**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
|  text     | string       |               |
|  gramSize     | Number       | Default = 2              |

**Returns**
`Array<string>`


#### `getWordNGrams(text)`
Gets 2-word pairs from text.

Note: This doesn't use sentence punctuation as a boundary. Should it?

**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
|   text     | string      |               |
|   gramSize     | number      |    default=2           |

**Returns**
`Array<string>`

#### `getFrequencyMap(frequencyMap)`
 converts an array of strings into a map of those strings and number of occurences 

**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
| ngramArray       | `Array<string>`       |               |

**Returns**
`Map<string, number>`

#### `getPercentMap(frequencyMap)`
 converts a frequency map into a map of percentages 

**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
|    frequencyMap   | `Map<string, number>`      |               |

**Returns**
`Map<string, number>`

#### `getTopGrams(frequencyMap)`
 filters a frequency map into only a small subset of the most frequent ones 
 
**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
| frequencyMap      |   `Map<string, number>`    |               |
| limit      |   number   |     default=20          |

**Returns**
`Map<string, number>`

#### `getIntersection(iterable1, iterable2)`
returns an array of items that occur in both iterables
 
**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
| iterable1      |   `Map|Array`    |               |
| iterable2      |   `Map|Array`    |               |

**Returns**
`Array<any>` 
An array of items that occur in both iterables. It will compare the keys, if sent a map

#### `getDisjunctiveUnion(iterable1, iterable2)`
returns an array of arrays of the unique items in either iterable
 
**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
| iterable1      |   `Map|Array`    |               |
| iterable2      |   `Map|Array`    |               |

**Returns**
`Array<Array<any>` 
An array of arrays of the unique items. The first item is the first parameter, 2nd item second param

#### `getComparison(iterable1, iterable2)`
returns a map containing various comparisons between two iterables
 
**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
| iterable1      |   `Map|Array`    |               |
| iterable2      |   `Map|Array`    |               |

**Returns**
`Map<string, <array>>` 
A map containing various comparisons between two iterables. Those comparisons will be some kind of array (See intersection or disjunctiveUnion)



### Instance Members
#### `sanitizedText`
lowercased text with diacritics removed

`string`
#### `letters`
 an array of letters in the text

`Array<string>`
#### `words`
 an array of words in the text

 `Array<string>`
#### `bigrams`
 an array of letter bigrams in the text

  `Array<string>`
#### `trigrams`
 an array of letter trigrams in the text

 `Array<string>`
#### `uniqueLetters`
 an array of unique letters in the text

 `Array<string>`
#### `uniqueBigrams`
 an array of unique bigrams in the text

 `Array<string>`
#### `uniqueTrigrams`
 an array of unique trigrams in the text

 `Array<string>`
#### `uniqueWords`
 an array of unique words in the text

  `Array<string>`
#### `letterFrequencies`
 a map of letter frequencies in the sanitized text

  `Map<string, number>`
#### `bigramFrequencies`
 a map of bigram frequencies in the sanitized text

  `Map<string, number>`
#### `trigramFrequencies`
 a map of trigram frequencies in the sanitized text

  `Map<string, number>`
#### `wordFrequencies`
 a map of word frequencies in the sanitized text

  `Map<string, number>`
#### `letterPercentages`
 a map of letter percentages in the sanitized text

  `Map<string, number>`
#### `bigramPercentages`
 a map of bigram percentages in the sanitized text

  `Map<string, number>`
#### `trigramPercentages`
 a map of trigram percentages in the sanitized text

  `Map<string, number>`
#### `wordPercentages`
 a map of word percentages in the sanitized text

  `Map<string, number>`

### Instance Methods

#### `getLetterNGrams(size)`
gets an array of customizeable ngrams in the text

**Parameters**
| name          | type  | Description   |
| ---           |---    | ---           |
|    size   | `number`      | default = 2  size of the n-gram to return       |

**Returns**
`Array<string>`

#### `getTopLetters(limit)`
 a map of the most used letters in the text

**Parameters**
| name          | type  | Description   |
| ---           |---    | ---           |
|    limit   | `number`      | default = 20  number of top letters to return       |

**Returns**
`Map<string, number>`

#### `getTopBigrams(limit)`
 a map of the most used bigrams in the text

**Parameters**
| name          | type  | Description   |
| ---           |---    | ---           |
|    limit   | `number`      | default = 20  number of top bigrams to return       |

**Returns**
`Map<string, number>`

#### `getTopTrigrams(limit)`
 a map of the most used trigrams in the text

**Parameters**
| name          | type  | Description   |
| ---           |---    | ---           |
|    limit   | `number`      | default = 20  number of top trigrams to return       |

**Returns**
`Map<string, number>`

#### `getTopWords(limit)`
 a map of the most used words in the text

**Parameters**
| name          | type  | Description   |
| ---           |---    | ---           |
|    limit   | `number`      | default = 20  number of top words to return       |

**Returns**
`Map<string, number>`


#### `compareTo(methodius)`
Compare this methodius instance to another

**Parameters**
| name          | type  | Description   |
| ---           |---    | ---           |
|    methodius   | `Methodius`      | another Methodius instance       |

**Returns**
`Map<string, Map>`
A map of property names and their comparisons (intersection, disjunctiveUnions, etc) for a set of properties

