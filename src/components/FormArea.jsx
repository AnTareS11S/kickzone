import MyDatePicker from './MyDatePicker';
import SelectData from './SelectData';
import { Checkbox } from './ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import classNames from 'classnames';

const FormArea = ({
  label,
  type,
  fileRef,
  currentUserPhoto,
  form,
  name,
  idFlag,
  isEdit,
  items,
  time,
  setFile,
  placeholder,
  isPortal,
  defaultValue,
  initialDate,
  isDisabled,
  styles,
  icon,
  ...rest
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='mb-6 flex flex-col'>
          <FormLabel className='mb-2 text-sm font-semibold text-gray-700'>
            {label}
          </FormLabel>
          <FormControl>
            {type === 'file' ? (
              <div className='flex flex-col items-center'>
                {name === 'logo' || name === 'postPhoto' ? (
                  ''
                ) : (
                  <img
                    src={
                      currentUserPhoto ||
                      'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                    }
                    className='mb-4 h-32 w-32 cursor-pointer rounded-full object-contain ring-2 ring-white transition duration-300 hover:ring-primary-500'
                    onClick={() => fileRef.current.click()}
                    alt='Profile Picture'
                  />
                )}
                <div className='flex items-center w-full'>
                  <span className='mr-2 text-primary-500'>{icon}</span>
                  <Input
                    id={name}
                    type={type}
                    ref={fileRef}
                    accept='image/*'
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      field.onChange(e.target.files?.[0] ?? undefined);
                    }}
                    {...fileRef}
                    {...rest}
                  />
                </div>
              </div>
            ) : type === 'textarea' ? (
              <div className='flex items-center'>
                <span className='mr-2 text-primary-500'>{icon}</span>
                <Textarea
                  id={name}
                  placeholder={placeholder}
                  rows={name === 'postContent' ? 15 : 1}
                  className={classNames(
                    'resize-none w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 transition duration-300',
                    name === 'postContent' && 'h-64'
                  )}
                  {...form.register(name)}
                  {...field}
                  {...rest}
                />
              </div>
            ) : type === 'select' ? (
              <div className='flex items-center'>
                <span className='mr-2 text-primary-500'>{icon}</span>
                <SelectData
                  id={name}
                  items={items}
                  defaultValue={defaultValue}
                  placeholder={placeholder}
                  idFlag={idFlag}
                  onChange={field.onChange}
                  isEdit={isEdit}
                />
              </div>
            ) : type === 'date' ? (
              <MyDatePicker
                id={name}
                initialDate={initialDate}
                time={time}
                onChange={(date) => field.onChange(date)}
                placeholderText={placeholder}
                isPortal={isPortal}
                isEdit={isEdit}
              />
            ) : type === 'checkbox' ? (
              <Checkbox
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
                className='w-8 h-8 justify-center'
              />
            ) : (
              <div className='flex items-center'>
                <span className='mr-2 text-primary-500'>{icon}</span>
                <Input
                  {...field}
                  id={name}
                  type={type}
                  className={classNames(
                    'w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 transition duration-300',
                    styles
                  )}
                  disabled={isDisabled}
                  placeholder={placeholder}
                  {...form.register(name)}
                  {...rest}
                />
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default FormArea;
