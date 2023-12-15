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
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import uploadFile from '../lib/uploadFile';
import { teamFormSchema } from '../lib/validation/TeamValidation';
import { zodResolver } from '@hookform/resolvers/zod';

const ModalActions = ({
  label,
  title,
  desc,
  onSubmit,
  coaches,
  data,
  coach,
}) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);

  const form = useForm({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      logo: '',
      bio: '',
      coach: '',
      stadium: '',
      yearFounded: '',
      country: '',
      city: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        logo: data.logo,
        bio: data.bio,

        stadium: data.stadium,
        yearFounded: data.yearFounded,
        country: data.country,
        city: data.city,
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
        <Button
          variant='outline'
          className='bg-blue-700 text-white hover:bg-blue-800 hover:text-white'
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-4 py-4'>
              <FormArea
                id='name'
                label='Name'
                type='text'
                form={form}
                name='name'
              />
              <FormArea
                id='logo'
                label='Logo'
                type='file'
                form={form}
                name='logo'
                fileRef={fileRef}
                setFile={setFile}
              />
              <FormArea
                id='bio'
                label='Bio'
                type='textarea'
                form={form}
                name='bio'
              />
              <FormArea
                id='coach'
                label='Coach'
                type='select'
                form={form}
                items={coaches}
                placeholder={coach}
                idFlag={true}
                name='coach'
              />
              <FormArea
                id='stadium'
                label='Stadium'
                type='select'
                form={form}
                name='stadium'
              />
              <FormArea
                id='yearFounded'
                label='Founded Year'
                type='number'
                form={form}
                name='yearFounded'
              />

              <FormArea
                id='country'
                label='Country'
                type='select'
                form={form}
                name='country'
              />
              <FormArea
                id='city'
                label='City'
                type='text'
                form={form}
                name='city'
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type='submit'
                  className='bg-blue-700 text-white hover:bg-blue-800 hover:text-white'
                  disabled={!form.formState.isValid}
                >
                  {title}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalActions;
