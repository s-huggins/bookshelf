const rpn = require('request-promise-native');
const xml2js = require('xml2js');
const UrlBuilder = require('../utils/UrlBuilder');

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
