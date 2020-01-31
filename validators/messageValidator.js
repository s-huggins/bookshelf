const validator = require('validator');
const catchAsync = require('../utils/asyncErrorWrapper');
const AppError = require('../utils/AppError');
const Profile = require('../models/Profile');

module.exports = catchAsync(async (req, res, next) => {
  let isValid = false;
  const errors = {};

  const { to, subject, body } = req.body;

  if (!validator.default.isLength(subject, { max: 250 })) {
    errors.subject =
      'Your message subject cannot be longer than 250 characters.';
  }
  if (!validator.default.isLength(body, { max: 20000 })) {
    errors.body = 'Your message body cannot be longer than 20000 characters.';
  }
  if (validator.default.isEmpty(body)) {
    errors.body = 'Your message body cannot be empty.';
  }

  // verify each profile in to array exists
  // otherwise remove those that don't exist
  // afterwards, if the array is empty, error out
  const recipients = await Profile.find(
    { id: { $in: to } },
    {},
    { lean: true }
  );
  // const recipients = await Profile.find({ id: { $in: to } });
  if (!recipients.length) {
    errors.to = 'Your message is not addressed to any existing accounts.';
  } else {
    req.recipients = recipients;
  }

  isValid = Object.keys(errors).length === 0;

  if (!isValid) {
    return next(new AppError('Message was not sent.', 400, errors));
  }

  next();
});
