import moment from 'moment';

export default (year, month, day) => {
  if (!year) return '';

  if (!month) return `${year}`;

  if (!day) {
    const date = moment(`${year}-${month}`);
    return date.isValid() ? date.format('MMMM YYYY') : '';
  }

  const date = moment(`${year}-${month}-${day}`);
  return date.isValid() ? date.format('MMMM Do YYYY') : '';
};
