/* eslint-disable no-use-before-define */
const rpn = require('request-promise-native');
const xml2js = require('xml2js');
const UrlBuilder = require('../utils/UrlBuilder');
const Rewriter = require('../utils/rewriteLinks');
const Book = require('../models/Book');

exports.getAuthorProfile = async (req, res) => {
  const apiEndPoint = UrlBuilder.buildAuthorProfile(req.params.authorId);
  try {
    const xmlString = await rpn(apiEndPoint);
    const parser = new xml2js.Parser({
      ignoreAttrs: true,
      explicitArray: false
    });

    const json = await parser.parseStringPromise(xmlString);
    const data = json.GoodreadsResponse.author;

    data.about = new Rewriter(data.about)
      .rewriteLinks()
      .removeGoodreadsLinks()
      .print();
    data.influences = new Rewriter(data.influences)
      .rewriteLinks()
      .removeGoodreadsLinks()
      .print();

    if (data.books) {
      data.books = !Array.isArray(data.books.book)
        ? [data.books.book]
        : data.books.book;

      data.books.forEach(book => {
        book.author = Array.isArray(book.authors.author)
          ? book.authors.author[0]
          : book.authors.author;
        delete book.authors;
      });
    }

    delete data.fans_count;
    delete data.author_followers_count;
    delete data.goodreads_author;
    // delete data.works_count;
    await setRatings(data);

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({
        status: 'fail',
        message: 'Page not found.'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};

exports.getAuthorBooks = async (req, res) => {
  const { page = 1 } = req.query;
  let pageNum = parseInt(page, 10);
  pageNum = Number.isNaN(pageNum) || pageNum <= 0 ? 1 : pageNum;

  const apiEndPoint = UrlBuilder.buildAuthorBooks(req.params.authorId, pageNum);

  try {
    const xmlString = await rpn(apiEndPoint);
    const parser = new xml2js.Parser({
      ignoreAttrs: true,
      explicitArray: false
    });
    const parserAttr = new xml2js.Parser({
      explicitArray: false
    });

    // Promise.all?
    const json = await parser.parseStringPromise(xmlString);
    const jsonAttr = await parserAttr.parseStringPromise(xmlString);

    const data = json.GoodreadsResponse.author;

    const pagination = jsonAttr.GoodreadsResponse.author.books.$;
    pagination.start = +pagination.start;
    pagination.end = +pagination.end;
    pagination.total = +pagination.total;

    data.pagination = pagination;

    await transformData(data);

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({
        status: 'fail',
        message: 'Page not found.'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};

exports.getAuthorBooksWithImage = async (req, res) => {
  const { page = 1 } = req.query;

  let pageNum = parseInt(page, 10);
  pageNum = Number.isNaN(pageNum) ? 1 : Math.abs(pageNum);

  const booksEndpoint = UrlBuilder.buildAuthorBooks(
    req.params.authorId,
    pageNum
  );
  const authorEndpoint = UrlBuilder.buildAuthorProfile(req.params.authorId);

  const bookParser = new xml2js.Parser({
    ignoreAttrs: true,
    explicitArray: false
  });

  const attributeParser = new xml2js.Parser({
    explicitArray: false
  });

  const authorParser = new xml2js.Parser({
    ignoreAttrs: true,
    explicitArray: false
  });

  /* Goodreads API admits a maximum of 1 query per second. Two queries need to be made here, so I have
  serialized them with setTimeout. */
  try {
    const xmlStringBooks = await rpn(booksEndpoint);

    setTimeout(async () => {
      try {
        const [xmlStringAuthor, jsonBooks, jsonAttr] = await Promise.all([
          rpn(authorEndpoint),
          bookParser.parseStringPromise(xmlStringBooks),
          attributeParser.parseStringPromise(xmlStringBooks)
        ]);

        const jsonAuthor = await authorParser.parseStringPromise(
          xmlStringAuthor
        );

        const data = jsonBooks.GoodreadsResponse.author;

        const pagination = jsonAttr.GoodreadsResponse.author.books.$;
        data.pagination = pagination;
        pagination.start = +pagination.start;
        pagination.end = +pagination.end;
        pagination.total = +pagination.total;

        await transformData(data);

        data.authorImage = jsonAuthor.GoodreadsResponse.author.image_url;

        res.status(200).json({
          status: 'success',
          data
        });
      } catch (err) {
        if (err.statusCode === 404) {
          return res.status(404).json({
            status: 'fail',
            message: 'Page not found.'
          });
        }
        res.status(500).json({
          status: 'error',
          message: 'Something went wrong.'
        });
      }
    }, 1000);
    // End of setTimeout
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({
        status: 'fail',
        message: 'Page not found.'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};

const transformData = async data => {
  data.books = !Array.isArray(data.books.book)
    ? [data.books.book]
    : data.books.book;

  data.books.forEach(book => {
    delete book.text_reviews_count;
    delete book.uri;
    delete book.work;
    book.author = book.authors.author;
    delete book.author.text_reviews_count;
    delete book.author.average_rating; // TODO: author ratings? average from books?
    delete book.author.ratings_count;
    delete book.authors;
  });

  await setRatings(data);
};

const setRatings = async data => {
  // console.log('data.id is', data.id);
  const { books } = data;
  const tasks = [];
  tasks.push(Book.getAuthorRatingsData(+data.id));
  books.forEach(book => tasks.push(Book.findById(+book.id)));

  const [authorRatingsData, ...dbBooks] = await Promise.all(tasks);
  // set rating data for author
  if (authorRatingsData.length === 0) {
    data.author_ratings_count = 0;
    data.author_average_rating = 0;
  } else {
    const {
      author_ratings_count,
      author_average_rating
    } = authorRatingsData[0];
    data.author_ratings_count = author_ratings_count;
    data.author_average_rating = author_average_rating;
  }

  // set rating data for books
  dbBooks.forEach((dbBook, i) => {
    if (dbBook) {
      books[i].average_rating = dbBook.average_rating;
      books[i].ratings_count = dbBook.ratings.length;
    } else {
      books[i].average_rating = 0;
      books[i].ratings_count = 0;
    }
  });
};
