import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FormControl } from './ui/form';

const SelectData = ({
  placeholder,
  items,
  onChange,
  isDisabled,
  defaultValue,
  idFlag,
  isEdit,
}) => {
  return (
    <Select onValueChange={onChange}>
      <FormControl>
        <SelectTrigger
          disabled={isDisabled}
          className='w-full h-[36px] shadow-sm resize-none ring-2 ring-white hover:ring-primary-500 transition duration-300'
        >
          <SelectValue
            className='w-full'
            placeholder={isEdit ? defaultValue : placeholder}
          />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {Array.isArray(items) && items.length > 0 ? (
          <SelectGroup className={items.length > 4 ? 'h-48' : ''}>
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
            <SelectItem value='no-data' disabled>
              No data available
            </SelectItem>
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default SelectData;
