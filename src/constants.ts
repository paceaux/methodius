/** a string that can be used by a RegExp to identify start and ends of sentences */
const punctuations: RegexQuery = "\\.,;:!?‽¡¿⸘()\\[\\]{}<>’'«»…\"\n\t\r";

/** a string that can be used by a RegExp to identify symbols that can separate words */
const wordSeparators: RegexQuery =   '—\\.,;:!?‽¡¿⸘()\\[\\]{}<>«»…"\\s';

export {
  punctuations,
  wordSeparators,
};
