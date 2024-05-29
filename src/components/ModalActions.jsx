import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Form } from './ui/form';
import FormArea from './FormArea';
import { useEffect, useRef } from 'react';
import { Pencil1Icon, PlusCircledIcon } from '@radix-ui/react-icons';

const ModalActions = ({
  label,
  title,
  desc,
  onSubmit,
  data,
  fields,
  edit,
  form,
  add,
  setFile,
}) => {
  const fileRef = useRef(null);

  useEffect(() => {
    if (data) {
      form.reset({ ...data });
    }
  }, [data, form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {edit ? (
          <Pencil1Icon className='w-5 h-5 cursor-pointer' />
        ) : add ? (
          <PlusCircledIcon className='w-5 h-5 cursor-pointer' />
        ) : (
          <Button
            variant='outline'
            className='bg-primary-500 text-white hover:bg-purple-500 hover:text-white'
          >
            {label}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[825px] max-w-full mx-auto'>
        <div className='md:max-h-[75vh] md:overflow-y-auto max-md:p-4 mt-5 min-sm:max-h-[75vh] min-sm:overflow-y-auto min-sm:p-4 max-lg:max-h-[75vh] max-lg:overflow-y-auto max-lg:p-4'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{desc}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
                {fields.map((field) => (
                  <FormArea
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    form={form}
                    name={field.name}
                    items={field.items}
                    defaultValue={field.defaultValue}
                    initialDate={field.initialDate}
                    isPortal={field.isPortal}
                    placeholder={field.placeholder}
                    isEdit={edit}
                    time={field.time}
                    idFlag={field.idFlag}
                    fileRef={field.type === 'file' ? fileRef : null}
                    setFile={field.type === 'file' ? setFile : null}
                  />
                ))}
              </div>
              <DialogFooter className='flex justify-end'>
                {!form.formState.isValid && form.formState.errors !== 0 && (
                  <Dialog asChild>
                    <Button
                      type='submit'
                      className='bg-primary-500 text-white hover:bg-purple-500 hover:text-white'
                    >
                      {title}
                    </Button>
                  </Dialog>
                )}
                {(form.formState.isValid || !form.formState.errors) && (
                  <DialogClose asChild>
                    <Button
                      type='submit'
                      className='bg-primary-500 text-white hover:bg-purple-500 hover:text-white'
                    >
                      {title}
                    </Button>
                  </DialogClose>
                )}
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalActions;
