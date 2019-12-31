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
