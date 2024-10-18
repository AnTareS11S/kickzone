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
  onChange,
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
        <FormItem className='mb-6'>
          <FormLabel className='mb-2 text-sm font-semibold text-gray-700'>
            {label}
          </FormLabel>
          <FormControl>
            <div className='flex flex-row items-center gap-4'>
              {icon && <span className='text-gray-400'>{icon}</span>}
              {type === 'file' ? (
                <FileInput
                  field={field}
                  fileRef={fileRef}
                  setFile={setFile}
                  onChange={onChange}
                  name={name}
                  currentUserPhoto={currentUserPhoto}
                  {...rest}
                />
              ) : type === 'textarea' ? (
                <TextareaInput
                  field={field}
                  name={name}
                  form={form}
                  placeholder={placeholder}
                  {...rest}
                />
              ) : type === 'select' ? (
                <SelectInput
                  field={field}
                  name={name}
                  items={items}
                  defaultValue={defaultValue}
                  placeholder={placeholder}
                  idFlag={idFlag}
                  isEdit={isEdit}
                />
              ) : type === 'date' ? (
                <DateInput
                  field={field}
                  name={name}
                  initialDate={initialDate}
                  time={time}
                  placeholder={placeholder}
                  isPortal={isPortal}
                  isEdit={isEdit}
                />
              ) : type === 'checkbox' ? (
                <CheckboxInput field={field} name={name} />
              ) : (
                <DefaultInput
                  field={field}
                  type={type}
                  name={name}
                  isDisabled={isDisabled}
                  placeholder={placeholder}
                  styles={styles}
                  form={form}
                  {...rest}
                />
              )}
            </div>
          </FormControl>
          <FormMessage className='mt-1 text-xs text-red-500' />
        </FormItem>
      )}
    />
  );
};

const FileInput = ({
  field,
  fileRef,
  setFile,
  name,
  onChange,
  currentUserPhoto,
  ...rest
}) => (
  <div className='flex flex-col items-center'>
    {name === 'logo' || name === 'postPhoto' ? null : (
      <img
        src={
          currentUserPhoto ||
          'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
        }
        className='mb-4 h-32 w-32 cursor-pointer rounded-full object-cover ring-2 ring-white transition duration-300 hover:ring-primary-500'
        onClick={() => fileRef.current.click()}
        alt='Profile Picture'
      />
    )}
    <Input
      id={name}
      type='file'
      ref={fileRef}
      accept='image/*'
      onChange={(e) => {
        if (onChange) {
          onChange(e);
        }
        if (setFile) {
          setFile(e.target.files[0]);
        }
        field.onChange(e.target.files?.[0] ?? undefined);
      }}
      className='file:mr-4 file:py-0 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100'
      {...rest}
    />
  </div>
);

const TextareaInput = ({ field, name, placeholder, form, ...rest }) => (
  <Textarea
    {...field}
    id={name}
    placeholder={placeholder}
    rows={
      name === 'postContent' || name === 'content'
        ? 15
        : name === 'message'
        ? 5
        : 3
    }
    className={classNames(
      'w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 transition duration-300',
      name === 'postContent' && 'h-64',
      name === 'message' && 'h-32'
    )}
    {...form.register(name)}
    {...rest}
  />
);

const SelectInput = ({
  field,
  name,
  items,
  defaultValue,
  placeholder,
  idFlag,
  isEdit,
}) => (
  <SelectData
    id={name}
    items={items}
    defaultValue={defaultValue}
    placeholder={placeholder}
    idFlag={idFlag}
    onChange={field.onChange}
    isEdit={isEdit}
    className='w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 transition duration-300'
  />
);

const DateInput = ({
  field,
  name,
  initialDate,
  time,
  placeholder,
  isPortal,
  isEdit,
}) => (
  <MyDatePicker
    id={name}
    initialDate={initialDate}
    time={time}
    onChange={(date) => field.onChange(date)}
    placeholderText={placeholder}
    isPortal={isPortal}
    isEdit={isEdit}
    className='w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 transition duration-300'
  />
);

const CheckboxInput = ({ field, name }) => (
  <Checkbox
    id={name}
    checked={field.value}
    onCheckedChange={field.onChange}
    className='w-6 h-6'
  />
);

const DefaultInput = ({
  field,
  type,
  name,
  isDisabled,
  placeholder,
  styles,
  form,
  ...rest
}) => (
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
);

export default FormArea;
