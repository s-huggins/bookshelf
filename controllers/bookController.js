/* eslint-disable no-use-before-define */

const rpn = require('request-promise-native');
const xml2js = require('xml2js');
const UrlBuilder = require('../utils/UrlBuilder');
const fetchImage = require('../utils/fetchSourceImage');
const Book = require('../models/Book');
const Rewriter = require('../utils/rewriteLinks');

// exports.getBookProfile = async (req, res) => {
//   const apiEndPoint = UrlBuilder.buildBookProfile(req.params.bookId);

//   try {
//     const xmlString = await rpn(apiEndPoint);
//     const parser = new xml2js.Parser({
//       ignoreAttrs: true,
//       explicitArray: false
//     });

//     const json = await parser.parseStringPromise(xmlString);

//     const data = json.GoodreadsResponse.book;

//     delete data.reviews_widget;
//     delete data.series_works;
//     delete data.book_links;
//     delete data.buy_links;
//     delete data.popular_shelves;

//     data.image_url = await fetchImage(data.image_url);

//     const dbBook = await Book.findById(+data.id);
//     if (dbBook) {
//       data.ratings_count = dbBook.ratings.length;
//       data.average_rating = dbBook.average_rating;
//     } else {
//       data.ratings_count = 0;
//       data.average_rating = 0;
//     }

//     // this takes too long to use
//     // const previews = await getAuthorPreviews(buildAuthorsArray(data.authors));

//     res.status(200).json({
//       status: 'success',
//       data
//     });
//   } catch (err) {
//     if (err.statusCode === 404) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Page not found.'
//       });
//     }
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went wrong.'
//     });
//   }
// };

exports.getBookProfile = async (req, res) => {
  const apiEndPoint = UrlBuilder.buildBookProfile(req.params.bookId);

  try {
    const xmlString = await rpn(apiEndPoint);
    const parser = new xml2js.Parser({
      ignoreAttrs: true,
      explicitArray: false
    });

    const json = await parser.parseStringPromise(xmlString);

    const data = json.GoodreadsResponse.book;

    delete data.reviews_widget;
    delete data.series_works;
    delete data.book_links;
    delete data.buy_links;
    delete data.popular_shelves;

    data.image_url = await fetchImage(data.image_url);

    const dbBook = await Book.findById(+data.id);
    if (dbBook) {
      data.ratings_count = dbBook.ratings.length;
      data.average_rating = dbBook.average_rating;
    } else {
      data.ratings_count = 0;
      data.average_rating = 0;
    }

    setTimeout(async () => {
      const authorPreviews = await getAuthorPreviews(
        buildAuthorsArray(data.authors)
      );

      data.authorPreviews = authorPreviews;
      res.status(200).json({
        status: 'success',
        data
      });
    }, 1000);
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

/** The JSON GoodreadsResponse.book.authors.author key may hold an author object
 * or array or author objects. This function reduces the two cases to an array.
 *
 * @param json.GoodreadsResponse.book.authors
 */
const buildAuthorsArray = authors => {
  if (!Array.isArray(authors.author)) {
    // single author
    return [authors.author];
  }

  return authors.author;
};

// TODO: ARE WE PENALIZED FOR QUERYING MORE THAN 1 TIMES PER SECOND? TEST WITH A TIMEOUT INSTEAD

// const getAuthorPreviews = async authorsArray => {
//   const authorIds = authorsArray.map(auth => auth.id); // array of string ints, e.g. ['1223', '73']
//   const apiEndPoints = authorIds.map(id => UrlBuilder.buildAuthorProfile(id));

//   try {
//     const xmlStrings = await Promise.all(apiEndPoints.map(rpn));
//     const jsonAuthors = await Promise.all(
//       xmlStrings.map(
//         new xml2js.Parser({
//           ignoreAttrs: true,
//           explicitArray: false
//         }).parseStringPromise
//       )
//     );

//     return jsonAuthors;

//     // res.status(200).json({
//     //   status: 'success',
//     //   data
//     // });
//   } catch (err) {
//     console.log('ERROR', err);
//   }
// };

// take only first author from array?
const getAuthorPreviews = async authorsArray => {
  const authorIds = authorsArray
    .filter(auth => !auth.role)
    .map(auth => auth.id); // array of string ints, e.g. ['1223', '73']
  const apiEndPoints = authorIds.map(id => UrlBuilder.buildAuthorProfile(id));

  try {
    const xmlStrings = await Promise.all(apiEndPoints.map(rpn));
    const jsonAuthors = await Promise.all(
      xmlStrings.map(
        new xml2js.Parser({
          ignoreAttrs: true,
          explicitArray: false
        }).parseStringPromise
      )
    );

    return jsonAuthors
      .map(jsonAuthor => jsonAuthor.GoodreadsResponse.author)
      .map(_author => {
        const author = {
          id: _author.id,
          name: _author.name,
          image_url: _author.image_url || _author.large_image_url
        };

        const books = Array.isArray(_author.books.book)
          ? _author.books.book
          : [_author.books.book];
        author.books = books.map(book => ({
          id: book.id,
          title: book.title,
          title_without_series: book.title_without_series,
          image_url: book.image_url || book.small_image_url,
          description: new Rewriter(book.description)
            .rewriteLinks()
            .removeGoodreadsLinks()
            .print()
          /* ALSO FETCH LOCAL RATINGS ?? */
        }));

        return author;
      });

    // res.status(200).json({
    //   status: 'success',
    //   data
    // });
  } catch (err) {
    console.log('ERROR', err);
  }
};
