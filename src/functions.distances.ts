import {
  sanitizeText,
} from './functions.tokenizers';

import {getNGrams} from './functions.ngrams';

type HammingDistance = {
  differences: number;
  percentDifferent: number;
};

function getHammingDistance(
  string1: string = '',
  string2: string = '',
  shouldSanitize: boolean = true
) : HammingDistance | null {
	if (string1.length !== string2.length) {
  	return null;
  }
  
  const sanitizedString1 = shouldSanitize
  	? sanitizeText(string1).trim()
    : string1.trim();
  const sanitizedString2 = shouldSanitize
  	? sanitizeText(string2).trim()
    : string2.trim();
    
   let differences = 0;
   
   [...sanitizedString1].forEach((char, str1CharIndex) => {
   	if (sanitizedString2[str1CharIndex] !== char) {
    	differences = differences + 1;
    }
   });

	const percentage = (differences / string1.length);
	return {
  	differences,
    percentDifferent: percentage,
  };
}

function getLevenshteinDistance(string1: string, string2: string, shouldSanitize: boolean = true): number {
  const sanitizedString1 = shouldSanitize
  	? sanitizeText(string1).trim()
    : string1.trim();
  const sanitizedString2 = shouldSanitize
  	? sanitizeText(string2).trim()
    : string2.trim();
  const [longerString, shorterString] = [sanitizedString1, sanitizedString2]
    .sort((a, b) => b.length - a.length);
  const maxDistance = longerString.length;

  const ngrams1 = getNGrams(string1, 2);
  const ngrams2 = getNGrams(string2, 2);





    return levenshtein;
}

export {
  getHammingDistance,
  getLevenshteinDistance,
}
