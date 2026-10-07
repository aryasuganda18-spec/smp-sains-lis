export const escapeLike = (term: string) => term.replace(/[\\%_]/g, '\\$&');

export const sanitizeSearchTerm = (term: string) =>
  term.replace(/[^\p{L}\p{N} .'@+-]/gu, '').trim().slice(0, 60);
