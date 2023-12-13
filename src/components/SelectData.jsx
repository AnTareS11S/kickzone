/* eslint-disable react/prop-types */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FormControl } from './ui/form';

const SelectData = ({ placeholder, items, onChange, defaultValue }) => {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectData;
