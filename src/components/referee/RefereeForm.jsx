import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import FormArea from '../FormArea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import { usersFormSchema } from '../../lib/validation/UsersValidation';
import { useToast } from '../ui/use-toast';
import Spinner from '../Spinner';
import { Card } from '../ui/card';
import { GetCountries } from '../../api/getCountries';
import { GetRefereeByUserId } from '../../api/getRefereeByUserId';

const RefereeForm = ({ currentUser }) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const countries = GetCountries();
  const [isChanged, setIsChanged] = useState(false);
  const { referee: refereeData, loading } = GetRefereeByUserId(isChanged);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(usersFormSchema(refereeData ? true : false)),
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
        ...refereeData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refereeData, isChanged]);

  const originalDate = form.getValues('birthDate');
  const formattedDate = new Date(originalDate);

  const countryName = countries?.find((country) =>
    country.id.includes(refereeData?.nationality)
  );

  const onSubmit = async (formData) => {
    const countryId = countries.find((country) =>
      country.name.includes(formData?.nationality)
    );

    const data = new FormData();

    data.append('photo', file || refereeData?.photo);
    data.append('name', formData.name);
    data.append('surname', formData.surname);
    data.append('bio', formData.bio);
    data.append('city', formData.city);
    data.append('birthDate', formattedDate);
    data.append('nationality', countryId?.id || formData.nationality);
    data.append('user', currentUser?._id);

    try {
      const res = await fetch('/api/referee/add', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Referee profile updated successfully',
        });
        setIsChanged(!isChanged);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update referee profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Card className='px-4 py-8'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType='multipart/form-data'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FormArea
              id='name'
              label='Name'
              type='text'
              form={form}
              name='name'
            />
            <FormArea
              id='surname'
              label='Surname'
              type='text'
              form={form}
              name='surname'
            />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FormArea
              id='birthDate'
              label='Date of Birth'
              type='date'
              form={form}
              name='birthDate'
              isEdit={true}
              initialDate={refereeData?.birthDate || new Date()}
              placeholder='Select date'
            />
            <FormArea
              id='nationality'
              type='select'
              form={form}
              items={countries}
              label='Nationality'
              placeholder={countryName?.name || 'Select nationality'}
              name='nationality'
              idFlag={true}
            />
          </div>
          <FormArea
            id='bio'
            label='Bio'
            type='textarea'
            form={form}
            name='bio'
          />
          <FormArea
            id='city'
            label='City'
            type='text'
            form={form}
            name='city'
          />
          <FormArea
            id='photo'
            label='Photo'
            type='file'
            form={form}
            name='photo'
            fileRef={fileRef}
            setFile={setFile}
            currentUserPhoto={refereeData?.imageUrl}
          />

          <div className='flex justify-end'>
            <Button
              type='submit'
              className='bg-primary-500 hover:bg-purple-500 px-6 py-3 rounded-md text-white font-semibold'
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default RefereeForm;
