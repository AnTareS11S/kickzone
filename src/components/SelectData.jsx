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
import { Input } from './ui/input';

const SelectData = ({ placeholder, items, onChange, defaultValue, idFlag }) => {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          {Array.isArray(items) &&
            items.map((item) => (
              <SelectItem
                key={item.split(':')[1]}
                value={idFlag ? item.split(':')[1] : item.split(':')[0]}
              >
                {item.split(':')[0]}
              </SelectItem>
            ))}
          <Input className='hidden' />
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectData;
