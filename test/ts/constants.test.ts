import { expect, it } from '@jest/globals';
import { punctuations, wordSeparators } from '../../src/constants';

it('has all the common punctuations', () => {
  expect(punctuations).toEqual(
    "\\.,;:!?‽¡¿⸘()\\[\\]{}<>’'«»…\"\n\t\r",
  );
});
it('has common word Separators', () => {
  expect(wordSeparators).toEqual(
    '—\\.,;:!?‽¡¿⸘()\\[\\]{}<>«»…"\\s',
  );
});
