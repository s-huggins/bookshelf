/**
 * Image resources returned by the Goodreads API are URLs to small thumbnails. Testing shows these
 * URLs can sometimes be tweaked to obtain the larger source image. This helper does just that,
 * probing for the larger image resource while maintaining the thumbnail as a fallback position.
 *
 * Example
 *
 * Miniaturized thumbnail:
 * https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1555447414l/44767458._SX98_.jpg
 *
 * Larger version:
 * https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1555447414l/44767458.jpg
 *
 */

const rpn = require('request-promise-native');

// precompile regular exp for closure
const regex = /((?:.*)\/books\/(?:\d+)l\/(?:\d+))(?:.*)(.jpg|.png)/;

const fetchImg = async thumbnailUrl => {
  const match = regex.exec(thumbnailUrl);
  if (match) {
    const origUrl = match[1] + match[2];
    try {
      const res = await rpn(origUrl, { resolveWithFullResponse: true });
      if (res && res.headers && res.headers['content-type'].startsWith('image'))
        return origUrl;
    } catch (err) {
      return thumbnailUrl;
    }
  }

  return thumbnailUrl;
};

module.exports = fetchImg;
