const rpn = require('request-promise-native');
const xml2js = require('xml2js');
const UrlBuilder = require('../utils/UrlBuilder');
const Rewriter = require('../utils/rewriteLinks');

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

    if (data.books)
      data.books.book = !Array.isArray(data.books.book)
        ? [data.books.book]
        : data.books.book;

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

// PAGINATEPAGINATEPAGINATEPAGINATEPAGINATEPAGINATEPAGINATEPAGINATEPAGINATE
exports.getAuthorBooks = async (req, res) => {
  const { page = 1 } = req.query;
  let pageNum = parseInt(page, 10);
  pageNum = Number.isNaN(pageNum) ? 1 : Math.abs(pageNum);

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

    const json = await parser.parseStringPromise(xmlString);
    const jsonAttr = await parserAttr.parseStringPromise(xmlString);

    const data = json.GoodreadsResponse.author;
    const pagination = jsonAttr.GoodreadsResponse.author.books.$;

    data.pagination = pagination;

    data.books.book = !Array.isArray(data.books.book)
      ? [data.books.book]
      : data.books.book;

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
