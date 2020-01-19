import moment from 'moment';
import pluralize from './pluralize';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const getMonth = monthNumber => monthNames[monthNumber];

/* USED ON PROFILE DETAILS */
export const lastActive = date => {
  const lastActivity = new Date(date);
  const today = new Date();

  if (lastActivity.getFullYear() === today.getFullYear()) {
    if (lastActivity.getMonth() === today.getMonth())
      return 'last active this month';
  }

  return `last active in ${
    monthNames[lastActivity.getMonth()]
  }, ${lastActivity.getFullYear()}`;
};

/* USED INLINE ON PANELS */
export const printTimeAgo = date => {
  // const time = moment(date);
  let activityString = '';
  const currentTime = new Date();
  const secsAgo = Math.floor((currentTime - date) / 1000);

  if (secsAgo < 60) {
    // less that a minute ago
    return 'just now';
  } else if (secsAgo < 60 * 60) {
    // less than an hour ago
    const minsAgo = Math.floor(secsAgo / 60);
    return `${minsAgo} ${pluralize('minute', minsAgo)} ago`;
  } else if (secsAgo < 60 * 60 * 24) {
    // less than 1 day ago
    const hoursAgo = Math.floor(secsAgo / (60 * 60));
    const minsAgo = Math.floor(secsAgo / 60);

    const minsRemainder = Math.floor(Math.floor(secsAgo / 60) - hoursAgo * 60);

    return (
      `${hoursAgo} ` +
      pluralize('hour', hoursAgo) +
      ', ' +
      `${minsRemainder} ` +
      pluralize('min', minsRemainder) +
      ' ago'
    );
  } else if (secsAgo < 60 * 60 * 24 * 2) {
    // less than 2 days ago
    const timeStr = moment(date).format('h:mm A');
    return `yesterday, ${timeStr}`;
  } else {
    return moment(date).format('MMM DD, YYYY h:mm A');
  }
};
