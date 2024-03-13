/* eslint-disable react/prop-types */
// MyDatePicker.js
import { getMonth, getYear, isValid, parseISO } from 'date-fns';
import { useState, forwardRef, useImperativeHandle } from 'react';
import DatePicker from 'react-datepicker';
import range from 'lodash/range';

import 'react-datepicker/dist/react-datepicker.css';

const MyDatePicker = forwardRef(function MyDatePicker(
  { onChange, selected, time, ...rest },
  ref
) {
  const initialDate = isValid(parseISO(selected)) ? parseISO(selected) : null;

  const [startDate, setStartDate] = useState(initialDate);
  const years = range(1990, getYear(new Date()) + 1, 1);
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
    'December',
  ];

  // Expose setStartDate function through ref
  useImperativeHandle(
    ref,
    () => ({
      setStartDate,
    }),
    [setStartDate]
  );

  return (
    <DatePicker
      className='border p-2 rounded-md shadow-sm w-full resize-none ring-2 ring-white hover:ring-primary-500 transition duration-300'
      showTimeSelect={time}
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
          <button
            className='border p-2 rounded-md shadow-md mb-2 md:mb-0'
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
          >
            {'<'}
          </button>
          <div className='flex w-full gap-2'>
            <select
              className='border p-2 rounded-md shadow-md w-1/2 md:w-auto'
              value={getYear(date)}
              onChange={({ target: { value } }) => changeYear(value)}
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              className='border p-2 rounded-md shadow-md w-1/2 md:w-auto'
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            className='border p-2 rounded-md shadow-md'
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
          >
            {'>'}
          </button>
        </div>
      )}
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        onChange(date);
      }}
      {...rest}
    />
  );
});

export default MyDatePicker;
