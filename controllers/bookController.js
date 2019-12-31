/* eslint-disable no-use-before-define */

const rpn = require('request-promise-native');
const xml2js = require('xml2js');
const UrlBuilder = require('../utils/UrlBuilder');
const fetchImage = require('../utils/fetchSourceImage');

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

    data.image_url = await fetchImage(data.image_url);

    // this takes too long to use
    // const previews = await getAuthorPreviews(buildAuthorsArray(data.authors));

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

const getAuthorPreviews = async authorsArray => {
  const authorIds = authorsArray.map(auth => auth.id); // array of string ints, e.g. ['1223', '73']
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

    return jsonAuthors;

    // res.status(200).json({
    //   status: 'success',
    //   data
    // });
  } catch (err) {
    console.log('ERROR', err);
  }
};
