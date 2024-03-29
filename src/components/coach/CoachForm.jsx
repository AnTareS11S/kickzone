import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';

import FormArea from '../FormArea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import uploadFile from '../../lib/uploadFile';
import { usersFormSchema } from '../../lib/validation/UsersValidation';
import { useFetchCountries } from '../hooks/useFetchCountries';
import Spinner from '../../components/Spinner';

const CoachForm = ({ currentUser }) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const countries = useFetchCountries();
  const [coachData, setCoachData] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(usersFormSchema),
    defaultValues: {
      name: '',
      surname: '',
      nationality: '',
      city: '',
      bio: '',
      birthDate: '',
      photo: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (coachData) {
      form.reset({
        name: coachData.name,
        surname: coachData.surname,
        nationality: coachData.nationality,
        city: coachData.city,
        bio: coachData.bio,
        birthDate: coachData.birthDate.slice(0, 10),
        photo: coachData.photo,
      });
    }
  }, [coachData, form]);

  useEffect(() => {
    const getCoach = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/coach/get/${currentUser?._id}`);
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch data!');
        }
        const data = await res.json();

        setCoachData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getCoach();
  }, [currentUser._id, updateSuccess]);

  useEffect(() => {
    const handleFileUpload = async () => {
      if (!file) return;

      await uploadFile(file, setFile, setUploadProgress);

      form.setValue('photo', file);
      setUpdateSuccess(true);
    };

    handleFileUpload();
  }, [file, form, setFile, setUploadProgress]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [updateSuccess]);

  const originalDate = form.getValues('birthDate');
  const formattedDate = new Date(originalDate);

  const countryName = countries?.find((country) =>
    country.split(':')[1].includes(coachData?.nationality)
  );

  const onSubmit = async (formData) => {
    const countryId = countries.find((country) =>
      country.split(':')[0].includes(formData?.nationality)
    );

    const updatedData = {
      ...formData,
      user: currentUser._id,
      photo: form?.getValues('photo') || '',
      nationality: countryId?.split(':')[1],
      dateOfBirth: formattedDate,
    };

    try {
      const res = await fetch('/api/coach/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data!');
      }
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );
  }

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
          currentUserPhoto={coachData?.photo}
          uploadProgress={uploadProgress}
        />
        <FormArea id='bio' label='Bio' type='textarea' form={form} name='bio' />
        <FormArea
          id='nationality'
          type='select'
          form={form}
          items={countries}
          label='Nationality'
          placeholder={countryName?.split(':')[0] || 'Select nationality'}
          name='nationality'
          className='w-full'
        />
        <FormArea id='city' label='City' type='text' form={form} name='city' />

        <div className='flex justify-start items-center'>
          <Button
            type='submit'
            disabled={!form.formState.isValid}
            className='bg-primary-500 hover:bg-purple-500'
          >
            Save
          </Button>
          {updateSuccess && <p className='text-green-700 ml-3'>Saved</p>}
        </div>
      </form>
    </Form>
  );
};

export default CoachForm;
