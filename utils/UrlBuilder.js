class UrlBuilder {
  static get GR_API_BOOK_SEARCH() {
    return 'https://www.goodreads.com/search/index.xml';
  }

  static get GR_API_BOOK_PROFILE() {
    return 'https://www.goodreads.com/book/show'; // /:bookId.xml
  }

  static get GR_API_AUTHOR_PROFILE() {
    return 'https://www.goodreads.com/author/show'; // /:authorId?format=xml
  }

  static encodeQuery(query) {
    return encodeURIComponent(query);
  }

  static buildBookSearch(query, filterOption = 'all', page = 1) {
    const q = UrlBuilder.encodeQuery(query);
    return `${UrlBuilder.GR_API_BOOK_SEARCH}?key=${process.env.GOODREADS_KEY}&q=${q}&search[field]=${filterOption}&page=${page}`;
  }

  static buildBookProfile(bookId) {
    return `${UrlBuilder.GR_API_BOOK_PROFILE}/${bookId}.xml?key=${process.env.GOODREADS_KEY}`;
  }

  static buildAuthorProfile(authorId) {
    return `${UrlBuilder.GR_API_AUTHOR_PROFILE}/${authorId}?format=xml&key=${process.env.GOODREADS_KEY}`;
  }
}

module.exports = UrlBuilder;
