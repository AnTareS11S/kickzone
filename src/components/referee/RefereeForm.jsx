import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import FormArea from '../FormArea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import uploadFile from '../../lib/uploadFile';
import { usersFormSchema } from '../../lib/validation/UsersValidation';
import { useFetchCountries } from '../hooks/useFetchCountries';
import { useToast } from '../ui/use-toast';
import { useFetchRefereeByUserId } from '../hooks/useFetchReferee';
import Spinner from '../Spinner';

const RefereeForm = ({ currentUser }) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const countries = useFetchCountries();
  const { referee: refereeData, loading } = useFetchRefereeByUserId();
  const { toast } = useToast();

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
    if (refereeData) {
      form.reset({
        name: refereeData?.name || '',
        surname: refereeData?.surname || '',
        nationality: refereeData?.nationality || '',
        city: refereeData?.city || '',
        bio: refereeData?.bio || '',
        birthDate: refereeData?.birthDate || '',
        photo: refereeData?.photo || '',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSuccess, file]);

  const handleFileUpload = async (file) => {
    try {
      const downloadURL = await uploadFile(file);
      form.setValue('photo', downloadURL);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  const originalDate = form.getValues('birthDate');
  const formattedDate = new Date(originalDate);

  const countryName = countries?.find((country) =>
    country.split(':')[1].includes(refereeData?.nationality)
  );

  const onSubmit = async (formData) => {
    const countryId = countries.find((country) =>
      country.split(':')[0].includes(formData?.nationality)
    );

    const updatedData = {
      ...formData,
      user: currentUser?._id,
      photo: form.getValues('photo'),
      nationality: countryId?.split(':')[1],
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

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Referee profile updated successfully',
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update referee profile',
          variant: 'destructive',
        });
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
          isEdit={true}
          initialDate={refereeData?.birthDate}
          placeholder='Select date'
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
          id='nationality'
          type='select'
          form={form}
          items={countries}
          label='Nationality'
          placeholder={countryName?.split(':')[0] || 'Select nationality'}
          name='nationality'
        />
        <FormArea id='city' label='City' type='text' form={form} name='city' />

        <div className='flex justify-start items-center'>
          <Button type='submit' className='bg-primary-500 hover:bg-purple-500'>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RefereeForm;
