import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import FormArea from '../FormArea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import { usersFormSchema } from '../../lib/validation/UsersValidation';
import { useFetchCountries } from '../hooks/useFetchCountries';
import Spinner from '../../components/Spinner';
import { useFetchCoachByUserId } from '../hooks/useFetchCoachByUserId';
import { useToast } from '../ui/use-toast';

const CoachForm = ({ currentUser }) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const countries = useFetchCountries();
  const [isChanged, setIsChanged] = useState(false);
  const { coach: coachData, loading } = useFetchCoachByUserId(isChanged);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(usersFormSchema),
    defaultValues: {
      name: '',
      surname: '',
      nationality: '',
      city: '',
      bio: '',
      birthDate: new Date(),
      photo: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (coachData) {
      form.reset({
        name: coachData?.name || '',
        surname: coachData?.surname || '',
        nationality: coachData?.nationality || '',
        city: coachData?.city || '',
        bio: coachData?.bio || '',
        birthDate: coachData?.birthDate || new Date(),
        photo: coachData?.imageUrl || '',
      });
    }
  }, [coachData, form, isChanged]);

  const originalDate = form.getValues('birthDate');
  const formattedDate = new Date(originalDate);

  const countryName = countries?.find((country) =>
    country.split(':')[1].includes(coachData?.nationality)
  );

  const onSubmit = async (formData) => {
    const countryId = countries.find((country) =>
      country.split(':')[0].includes(formData?.nationality)
    );

    const data = new FormData();

    data.append('photo', file || coachData?.photo);
    data.append('user', currentUser?._id);
    data.append('name', formData?.name);
    data.append('surname', formData?.surname);
    data.append(
      'nationality',
      countryId?.split(':')[1] || formData?.nationality
    );
    data.append('city', formData?.city);
    data.append('bio', formData?.bio);
    data.append('birthDate', formattedDate);

    try {
      const res = await fetch('/api/coach/create', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Coach profile updated successfully',
        });
        setIsChanged(!isChanged);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update coach profile',
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
          initialDate={coachData?.birthDate || new Date()}
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
          currentUserPhoto={coachData?.imageUrl}
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

export default CoachForm;
