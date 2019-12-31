const rpn = require('request-promise-native');
const xml2js = require('xml2js');
const UrlBuilder = require('../utils/UrlBuilder');

/**
 * Handler expects a query string of the form:
 * ?q=Dune&search[field]=all&page=1
 *
 * search[field] is optional and defaults to `all`. It may also be `title` or `author`.
 * page is optional and defaults to 1.
 */
exports.searchBooks = async (req, res) => {
  const {
    q: searchQuery,
    search: { field: filterOption = 'all' } = {},
    page = 1
  } = req.query;

  const apiEndPoint = UrlBuilder.buildBookSearch(
    searchQuery,
    filterOption,
    page
  );

  try {
    const xmlString = await rpn(apiEndPoint);
    const parser = new xml2js.Parser({
      ignoreAttrs: true,
      explicitArray: false
    });
    const json = await parser.parseStringPromise(xmlString); // parses XML string to JSON

    // return res.status(200).json({
    //   status: 'success',
    //   data: json
    // });

    const bookResults = json.GoodreadsResponse.search;

    const { query } = bookResults;
    const resultsStart = +bookResults['results-start'];
    const resultsEnd = +bookResults['results-end'];
    const totalResults = +bookResults['total-results'];
    const queryTimeSeconds = +bookResults['query-time-seconds'];
    const works = bookResults.results.work;

    const data = {
      query,
      queryTimeSeconds,
      resultsStart,
      resultsEnd,
      totalResults,
      works
    };

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    console.log('ERROR', err);

    res.status(500).json({
      status: 'fail',
      message: err.message || 'Something went wrong.'
    });
  }
};
