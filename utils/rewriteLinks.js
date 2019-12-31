/**
 * FUNCTIONS FOR REMOVING OR REPLACING INTERNAL GOODREADS LINKS EMBEDDED IN
 * AN HTML STRING WITH CUSTOM `BOOKSHELF` LINKS.
 */

/**
 * @description
 * Replaces all occurrences of anchor tags with their inner text content.
 *
 * @regex /<a[^>]*?>(.*)<\/a>/gi
 *
 * @example
 * in: `<a href="https://www.goodreads.com/author/show/947.William_Shakespeare">William Shakespeare</a>`
 *
 * out: `William Shakespeare`
 */
exports.removeLinks = text => {
  return text.replace(/<a[^>]*?>(.*)<\/a>/gi, '$1');
};

/**
 * @description
 * Replaces all occurrences of internal Goodreads anchor tags with their inner text content.
 * Same as above, but targets only links with `goodreads.com` in the href attribute.
 *
 * @regex /<a.*goodreads\.com.*>(.*)<\/a>/gi
 *
 */
exports.removeGoodreadsLinks = text => {
  return text.replace(/<a.*goodreads\.com.*>(.*)<\/a>/gi, '$1');
};

/**
 * @description
 * Replaces any link to a Goodreads author or book page with the corresponding `bookshelf` relative link.
 *
 * @regex /https?:\/\/www\.goodreads\.com\/(author|book)\/show\/(\d+).*?(?=")/gi
 *
 * @example
 * in: `<a href="https://www.goodreads.com/author/show/947.William_Shakespeare">William Shakespeare</a>`
 *
 * out: `<a href="/author/947">William Shakespeare</a>`
 *
 * @example
 * in: `https://www.goodreads.com/book/show/1420.Hamlet`
 *
 * out: `/book/1420`
 */

// /https?:\/\/www\.goodreads\.com\/(author|book)\/show\/(\d+).*(?=")/gi
exports.rewriteLinks = text => {
  return text.replace(
    /https?:\/\/www\.goodreads\.com\/(author|book)\/show\/(\d+).*?(?=")/gi,
    '/$1/$2'
  );
};
