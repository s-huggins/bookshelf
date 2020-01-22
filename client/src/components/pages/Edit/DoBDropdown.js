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
  1: 31,
  February: 29,
  2: 29,
  March: 31,
  3: 31,
  April: 30,
  4: 30,
  May: 31,
  5: 31,
  June: 30,
  6: 30,
  July: 31,
  7: 31,
  August: 31,
  8: 31,
  September: 30,
  9: 30,
  October: 31,
  10: 31,
  November: 30,
  11: 30,
  December: 31,
  12: 31
};

// maxYear chosen to ensure user age >= 13
const maxYear = new Date().getFullYear() - 13;
const minYear = 1903;

/* COMPONENT */
const DoBDropdown = ({ birthday, handleChange }) => {
  const [year, setYear] = useState('year');
  const [month, setMonth] = useState('month');
  const [day, setDay] = useState('day');

  const [monthDays, setMonthDays] = useState(31);
  const [birthdaySet, setBirthdaySet] = useState(false);

  const zeroPad = val => `0${val}`.slice(-2);

  /**
   * `birthday` prop to DoBDropdown is a string of the form yyyy-mm-ddT00:00:00.000+00.00,
   * e.g. 1992-12-17T00:00:00.000+00.00.
   * This function extracts the date components as numbers.
   */
  const initializeBirthday = dateString => {
    const bYear = +dateString.substring(0, 4);
    const bMonth = +dateString.substring(5, 7);
    const bDay = +dateString.substring(8, 10);

    return [bYear, bMonth, bDay];
  };

  useEffect(() => {
    if (birthday) {
      const [bYear, bMonth, bDay] = initializeBirthday(birthday);
      setYear(bYear);
      setMonth(bMonth);
      setDay(bDay);
      setMonthDays(monthLengths[bMonth]);
      setBirthdaySet(true);
    }
  }, [birthday]);

  const validate = (bYear, bMonth, bDay) => {
    // 13 or older validation
    if (bYear === maxYear) {
      const currentMonth = new Date().getMonth() + 1;
      const currentDay = new Date().getDate();
      if (currentMonth < bMonth) {
        bMonth = 1;
      }
      if (currentMonth === bMonth && currentDay < bDay) {
        bDay = 1;
      }
    }

    // month days validation
    if (bDay > monthLengths[bMonth]) {
      bDay = monthLengths[bMonth];
    }

    return [bYear, bMonth, bDay];
  };

  /* FUNCTIONS TO PROPAGATE VALIDATED BIRTHDAY CHANGE UP TO PARENT */

  const updateBirthday = (bYear, bMonth, bDay) => {
    [bYear, bMonth, bDay] = validate(bYear, bMonth, bDay);
    handleChange(`${bYear}-${zeroPad(bMonth)}-${zeroPad(bDay)}`);
  };

  const unsetBirthday = () => {
    handleChange(undefined);
  };

  /* DROPDOWN & RADIO HANDLERS */

  const handleYearChange = e => {
    const newYear = +e.target.value;
    setYear(newYear);
    updateBirthday(newYear, month, day);
  };
  const handleMonthChange = e => {
    const newMonth = +e.target.value;
    setMonth(newMonth);
    setMonthDays(monthLengths[newMonth]);
    updateBirthday(year, newMonth, day);
  };
  const handleDayChange = e => {
    const newDay = +e.target.value;
    setDay(newDay);
    updateBirthday(year, month, newDay);
  };

  const handleSetBirthday = e => {
    setBirthdaySet(e.target.value === 'yes');

    if (e.target.value === 'yes') {
      setYear(2000);
      setMonth(1);
      setDay(1);
      updateBirthday(2000, 1, 1);
    } else {
      setYear('year');
      setMonth('month');
      setDay('day');
      unsetBirthday();
    }
  };

  return (
    <>
      <div className="form-control--edit__radio">
        <span className="lead">Set my birthday</span>
        <label className="radio-label" htmlFor="set-birthday">
          <input
            type="radio"
            name="birthdaySet"
            value="yes"
            id="set-birthday"
            checked={birthdaySet}
            onChange={handleSetBirthday}
          />
          <span className="label-text">Yes</span>
        </label>
        <label className="radio-label" htmlFor="unset-birthday">
          <input
            type="radio"
            name="birthdaySet"
            value="no"
            id="unset-birthday"
            checked={!birthdaySet}
            onChange={handleSetBirthday}
          />
          <span className="label-text">No</span>
        </label>
      </div>

      <div className="form-control--edit__field--dob">
        <label htmlFor="dob" className="form-control--edit__label-dropdown">
          Date of Birth
        </label>
        <div>
          <select
            name="dob-year"
            id="dob-year"
            onChange={handleYearChange}
            value={year}
            disabled={!birthdaySet}
          >
            <option value="year" disabled>
              year
            </option>
            {Array.from({ length: maxYear - minYear + 1 }).map((_, ix) => (
              <option value={maxYear - ix} key={maxYear - ix}>
                {maxYear - ix}
              </option>
            ))}
          </select>
          <select
            name="dob-month"
            id="dob-month"
            onChange={handleMonthChange}
            value={month}
            disabled={!birthdaySet}
          >
            <option value="month" disabled>
              month
            </option>
            {months.map((m, i) => (
              <option
                value={i + 1}
                key={m}
                disabled={year === maxYear && i > new Date().getMonth()}
              >
                {m}
              </option>
            ))}
          </select>
          <select
            name="dob-day"
            id="dob-day"
            onChange={handleDayChange}
            value={day}
            disabled={!birthdaySet}
          >
            <option value="day" disabled>
              day
            </option>
            {Array.from({ length: monthDays }).map((_, i) => (
              <option
                value={i + 1}
                key={i + 1}
                disabled={
                  year === maxYear &&
                  month === new Date().getMonth() + 1 &&
                  i + 1 > new Date().getDate()
                }
              >
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default DoBDropdown;
