/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
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
import { useEffect, useRef, useState } from 'react';
import uploadFile from '../lib/uploadFile';

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
}) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
      });
    }
  }, [data, form]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      const downloadURL = await uploadFile(file);
      form.setValue('logo', downloadURL);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {edit ? (
          edit && <Pencil1Icon className='w-5 h-5 cursor-pointer' />
        ) : add ? (
          <PlusCircledIcon className='w-5 h-5 cursor-pointer' />
        ) : (
          <Button
            variant='outline'
            className='bg-blue-700 text-white hover:bg-blue-800 hover:text-white'
          >
            {label}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-4 py-4'>
              {fields.map((field) => (
                <FormArea
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  form={form}
                  name={field.name}
                  items={field.items}
                  placeholder={field.placeholder}
                  idFlag={field.idFlag}
                  fileRef={field.type === 'file' ? fileRef : undefined}
                  setFile={field.type === 'file' ? setFile : undefined}
                />
              ))}
            </div>
            <DialogFooter>
              {!form.formState.isValid && (
                <Dialog asChild>
                  <Button
                    type='submit'
                    className='bg-blue-700 text-white hover:bg-blue-800 hover:text-white'
                  >
                    {title}
                  </Button>
                </Dialog>
              )}
              {form.formState.isValid && (
                <DialogClose asChild>
                  <Button
                    type='submit'
                    className='bg-blue-700 text-white hover:bg-blue-800 hover:text-white'
                  >
                    {title}
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default ModalActions;
