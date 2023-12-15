/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';

import FormArea from '../FormArea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import uploadFile from '../../lib/uploadFile';
import { usersFormSchema } from '../../lib/validation/UsersValidation';

const RefereeForm = ({ currentUser, refereeData }) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(usersFormSchema),
    defaultValues: {
      name: '',
      surname: '',
      country: '',
      city: '',
      bio: '',
      birthDate: '',
      photo: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (refereeData) {
      form.reset({
        name: refereeData.name,
        surname: refereeData.surname,
        country: refereeData.country,
        city: refereeData.city,
        bio: refereeData.bio,
        birthDate: refereeData.birthDate.slice(0, 10),
        photo: refereeData.photo,
      });
    }
  }, [refereeData, form]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    const timeoutId = setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [updateSuccess, file]);

  const handleFileUpload = async (file) => {
    try {
      const downloadURL = await uploadFile(file);
      form.setValue('photo', downloadURL);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  const countries = ['Albania', 'Andorra', 'Austria', 'Poland'];

  const originalDate = form.getValues('birthDate');

  const formattedDate = new Date(originalDate);

  const onSubmit = async (formData) => {
    const updatedData = {
      ...formData,
      user: currentUser._id,
      photo: form.getValues('photo'),
      dateOfBirth: formattedDate,
    };
    try {
      const res = await fetch('/api/referee/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col space-y-4'
      >
        <FormArea id='name' label='Name' type='text' form={form} name='name' />
        <FormArea
          id='surname'
          label='Surname'
          type='text'
          form={form}
          name='surname'
        />
        <FormArea
          id='birthDate'
          label='Date of Birth'
          type='date'
          form={form}
          name='birthDate'
        />
        <FormArea
          id='photo'
          label='Photo'
          type='file'
          form={form}
          name='photo'
          fileRef={fileRef}
          setFile={setFile}
          currentUserPhoto={refereeData?.photo}
        />
        <FormArea id='bio' label='Bio' type='textarea' form={form} name='bio' />
        <FormArea
          id='country'
          type='select'
          form={form}
          items={countries}
          label='Country'
          placeholder={refereeData?.country || 'Select country'}
          name='country'
          className='w-full'
        />
        <FormArea id='city' label='City' type='text' form={form} name='city' />

        <div className='flex justify-start items-center'>
          <Button type='submit' disabled={!form.formState.isValid}>
            Save
          </Button>
          {updateSuccess && <p className='text-green-700 ml-3'>Saved</p>}
        </div>
      </form>
    </Form>
  );
};

export default RefereeForm;
