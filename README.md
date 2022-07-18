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
**Kind** Global Class

### Members (static)
#### `Punctuations`
characters to ignore when analyzing text
period, comma, semicolon, colon, bang, question mark, interrobang, Spanish bang+, parens, bracket, brace, single quote, some spaces

`\\.,;:!?‽¡¿⸘()\\[\\]{}<>’'…\"\n\t\r`

#### `wordSeparators`
characters to ignore AND CONSUME when trying to find words
em-dash, period, comman, semicolon, colon, bang, question mark, interrobang, Spanish bang+, parens, bracket, brace, single quote, space

`—\\.,;:!?‽¡¿⸘()\\[\\]{}<>…"\\s`


### Methods (static)
#### `hasPunctuation(string)`
 determins if string contains punctuation 
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
 This doesn't use sentence punctuation as a boundary. Should it? 
**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
|   text     | string      |               |
|   gramSize     | number      |    default=2           |

**Returns**
`Array<string>`

#### `getFrequencyMap(frequencyMap)`
**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
| ngramArray       | `Array<string>`       |               |

**Returns**
`Map<string, number>`

#### `getPercentMap(frequencyMap)`
**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
|    frequencyMap   | `Map<string, number>`      |               |

**Returns**
`Map<string, number>`

#### `getTopGrams(frequencyMap)`

**Parameters**
| name  | type  | Description   |
| ---   |---    | ---           |
| frequencyMap      |   `Map<string, number>`    |               |
| topCount      |   number   |     default=20          |

**Returns**
`Map<string, number>`

### Members (instance)

### Methods (instance)

