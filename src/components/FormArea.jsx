/* eslint-disable react/prop-types */
import SelectData from './SelectData';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const FormArea = ({
  label,
  type,
  fileRef,
  currentUserPhoto,
  form,
  name,
  items,
  setFile,
  placeholder,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === 'file' ? (
              <div className='flex items-center'>
                <img
                  src={currentUserPhoto}
                  alt='user'
                  className='w-24 h-24 rounded-full object-cover mt-2 self-center mx-auto cursor-pointer'
                  onClick={() => fileRef.current.click()}
                />
                <Input
                  id={name}
                  type={type}
                  ref={fileRef}
                  accept='image/*'
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            ) : type === 'textarea' ? (
              <Textarea
                id={name}
                placeholder={placeholder}
                className='resize-none w-full'
                {...form.register(name)}
                {...field}
              />
            ) : type === 'select' ? (
              <SelectData
                id={name}
                items={items}
                placeholder={placeholder}
                onChange={field.onChange}
              />
            ) : (
              <Input
                id={name}
                type={type}
                className='w-full'
                format={type === 'date' ? 'yyyy-MM-dd' : ''}
                value={type === 'date' ? '2023-03-23' : ''}
                {...form.register(name)}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default FormArea;
