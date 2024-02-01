/* eslint-disable react/prop-types */
// MyDatePicker.js
import { getMonth, getYear, isValid, parseISO } from 'date-fns';
import { useState, forwardRef, useImperativeHandle } from 'react';
import DatePicker from 'react-datepicker';
import range from 'lodash/range';

import 'react-datepicker/dist/react-datepicker.css';

const MyDatePicker = forwardRef(function MyDatePicker(
  { onChange, selected, ...rest },
  ref
) {
  const initialDate = isValid(parseISO(selected))
    ? parseISO(selected)
    : new Date();
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
      className='border p-2 rounded-md  grid w-[380px] h-[36px]'
      showTimeSelect
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className='flex items-center justify-center gap-4'>
          <button
            className='border  p-2 rounded-md shadow-md'
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
          >
            {'<'}
          </button>
          <div className='flex w-full gap-2'>
            <select
              className='border p-2 rounded-md shadow-md'
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
              className='border p-2 rounded-md shadow-md'
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
