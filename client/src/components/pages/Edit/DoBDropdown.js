import React, { useState, useEffect } from 'react';

/* BIRTHDAY HELPERS */
const months = [
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

for (let i = 0, monthNum = 1; i < months.length; i++) {
  months[months[i]] = monthNum;
  monthNum++;
}

const monthLengths = {
  January: 31,
  February: 29,
  March: 31,
  April: 30,
  May: 31,
  June: 30,
  July: 31,
  August: 31,
  September: 30,
  October: 31,
  November: 30,
  December: 31
};

const initializeBirthday = dateString => {
  // birthday prop gives birthdate in the form yyyy-mm-dd, e.g. 1992-01-01

  // get year as 4-digit string
  const birthYear = dateString.substring(0, 4);

  // get month as month name string
  const birthMonthNum = dateString.substring(5, 7);

  let birthMonthIndex = +birthMonthNum; // convert to number
  birthMonthIndex--; // for 0-indexed months array
  const birthMonthName = months[birthMonthIndex];

  let birthMonthDay = dateString.substring(8, 10);
  birthMonthDay = birthMonthDay.startsWith('0')
    ? birthMonthDay.substring(1)
    : birthMonthDay;

  return [birthYear, birthMonthNum, birthMonthName, birthMonthDay];
};

/* COMPONENT */
const DoBDropdown = ({ birthday, handleChange }) => {
  // states stored as strings
  // const [year, setYear] = useState(bYear);
  // const [month, setMonth] = useState(bMonth);
  // const [monthName, setMonthName] = useState(bMonthName);
  // const [day, setDay] = useState(bDay);
  // const [monthDays, setMonthDays] = useState(monthLengths[bMonthName]);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [monthName, setMonthName] = useState('');
  const [day, setDay] = useState('');
  const [monthDays, setMonthDays] = useState('');

  useEffect(() => {
    if (birthday) {
      const [bYear, bMonth, bMonthName, bDay] = initializeBirthday(birthday);
      setYear(bYear);
      setMonth(bMonth);
      setMonthName(bMonthName);
      setDay(bDay);
      setMonthDays(monthLengths[bMonthName]);
    }
  }, [birthday]);

  const maxYear = new Date().getFullYear() - 13;
  const minYear = 1903;

  const handleYearChange = e => {
    const newYear = e.target.value;
    setYear(newYear);
    handleChange(`${newYear}-${month}-${day}`);
  };
  const handleMonthChange = e => {
    const newMonthName = e.target.value;
    setMonthName(newMonthName);
    const newMonth =
      months[newMonthName] < 10
        ? `0${months[newMonthName]}`
        : `${months[newMonthName]}`;
    setMonth(newMonth);
    setMonthDays(monthLengths[newMonthName]);
    handleChange(`${year}-${newMonth}-${day}`);
  };
  const handleDayChange = e => {
    const newDay = e.target.value;
    const newDayString = newDay.length === 1 ? `0${newDay}` : `${newDay}`;
    setDay(newDayString);
    handleChange(`${year}-${month}-${newDayString}`);
  };

  return (
    <div className="form-control--edit__field--dob">
      <label htmlFor="dob">Date of Birth</label>
      <div>
        <select
          name="dob-year"
          id="dob-year"
          onChange={handleYearChange}
          value={year}
        >
          {Array.from({ length: maxYear - minYear + 1 }).map((_, ix) => (
            <option value={`${maxYear - ix}`} key={maxYear - ix}>
              {maxYear - ix}
            </option>
          ))}
        </select>
        <select
          name="dob-month"
          id="dob-month"
          onChange={handleMonthChange}
          value={monthName}
        >
          {months.map(m => (
            <option value={m} key={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          name="dob-day"
          id="dob-day"
          onChange={handleDayChange}
          value={day}
        >
          {Array.from({ length: monthDays }).map((_, ix) => (
            <option
              value={`${ix + 1}`}
              key={ix + 1}
              disabled={+year === maxYear && ix + 1 > new Date().getDate()}
            >
              {ix + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DoBDropdown;
