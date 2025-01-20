import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import FormArea from '../FormArea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import { usersFormSchema } from '../../lib/validation/UsersValidation';
import Spinner from '../../components/Spinner';
import { useToast } from '../ui/use-toast';
import { Card } from '../ui/card';
import { GetAdminByUserId } from '../../api/getAdminByUserId';
import { GetCountries } from '../../api/getCountries';

const AdminForm = ({ currentUser }) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const countries = GetCountries();
  const [isChanged, setIsChanged] = useState(false);
  const { admin: adminData, loading } = GetAdminByUserId(isChanged);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(usersFormSchema(adminData ? true : false)),
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
    if (adminData) {
      form.reset({
        ...adminData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminData, isChanged]);

  const originalDate = form.getValues('birthDate');
  const formattedDate = new Date(originalDate);

  const countryName = countries?.find((country) =>
    country.id.includes(adminData?.nationality)
  );

  const onSubmit = async (formData) => {
    const countryId = countries.find((country) =>
      country.name.includes(formData?.nationality)
    );

    const data = new FormData();

    data.append('photo', file || adminData?.photo);
    data.append('user', currentUser._id);
    data.append('name', formData.name);
    data.append('surname', formData.surname);
    data.append('nationality', countryId?.id || formData.nationality);
    data.append('city', formData.city);
    data.append('bio', formData.bio);
    data.append('birthDate', formattedDate);

    try {
      const res = await fetch('/api/admin/create', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Admin profile updated successfully',
        });
        setIsChanged(!isChanged);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update admin profile',
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
              initialDate={adminData?.birthDate || new Date()}
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
            currentUserPhoto={adminData?.imageUrl}
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

export default AdminForm;
