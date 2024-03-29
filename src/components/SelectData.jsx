import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FormControl } from './ui/form';

const SelectData = ({ placeholder, items, onChange, defaultValue, idFlag }) => {
  console.log(defaultValue);
  return (
    <Select onValueChange={onChange}>
      <FormControl>
        <SelectTrigger className='w-full h-[41.6px] shadow-sm resize-none  ring-2 ring-white hover:ring-primary-500 transition duration-300'>
          <SelectValue
            className='w-full'
            placeholder={defaultValue ? defaultValue : placeholder}
          />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {Array.isArray(items) && items.length > 0 ? (
          <SelectGroup>
            {items.map((item) => (
              <SelectItem
                key={item.split(':')[1]}
                value={idFlag ? item.split(':')[1] : item.split(':')[0]}
              >
                {item.split(':')[0]}
              </SelectItem>
            ))}
          </SelectGroup>
        ) : (
          <SelectGroup>
            <SelectItem value='No data'>No data</SelectItem>
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default SelectData;
