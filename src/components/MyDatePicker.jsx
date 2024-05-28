import { useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const MyDatePicker = ({
  onChange,
  initialDate,
  time,
  isPortal = true,
  isEdit,
  placeholderText = 'Select date',
  ...rest
}) => {
  const [startDate, setStartDate] = useState(
    isEdit ? new Date(initialDate) : null
  );

  return (
    <DatePicker
      className='border p-2 ml-2 h-[36px] rounded-md w-full shadow-sm ring-2 ring-white hover:ring-primary-500 transition duration-300'
      showTimeSelect={time}
      showMonthDropdown
      showYearDropdown
      autoComplete='off'
      scrollableYearDropdown
      yearDropdownItemNumber={120}
      placeholderText={placeholderText}
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        onChange(date);
      }}
      withPortal={isPortal}
      {...rest}
    />
  );
};

export default MyDatePicker;
