import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import FormArea from '../FormArea';
import { useToast } from '../ui/use-toast';
import Spinner from '../Spinner';
import { useFetchUserById } from '../hooks/useFetchUserById';
import { FaUserAlt, FaEnvelope, FaInfoCircle, FaImage } from 'react-icons/fa';
import { Card } from '../ui/card';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(4, { message: 'Username must be at least 4 characters.' })
    .max(30, { message: 'Username must not be longer than 30 characters.' }),
  email: z.string().email().min(4, { message: 'Email must be valid.' }),
  bio: z
    .string()
    .min(4, { message: 'Bio must be at least 4 characters.' })
    .max(160, { message: 'Bio must not be longer than 160 characters.' }),
});

const ProfileForm = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const [isChanged, setIsChanged] = useState(false);
  const { user, loading } = useFetchUserById(isChanged);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      photo: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        photo: user?.imageUrl || '',
      });
    }
  }, [user, form, isChanged]);

  const onSubmit = async (formData) => {
    const data = new FormData();
    data.append('photo', file || user?.photo);
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('bio', formData.bio);
    try {
      const res = await fetch(`/api/user/add/${user?._id}`, {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'User profile updated successfully',
        });
        setIsChanged(!isChanged);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update user profile',
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-row items-center mb-6'>
            <FormArea
              id='username'
              label='Username'
              type='text'
              form={form}
              name='username'
              icon={<FaUserAlt className='text-gray-500' />}
            />
          </div>
          <div className='mb-6'>
            <FormArea
              id='email'
              label='Email'
              type='text'
              form={form}
              name='email'
              icon={<FaEnvelope className='text-gray-500' />}
            />
          </div>
          <div className='mb-6'>
            <FormArea
              id='bio'
              label='Bio'
              type='textarea'
              form={form}
              name='bio'
              icon={<FaInfoCircle className='text-gray-500' />}
            />
          </div>
          <div className='mb-6'>
            <FormArea
              id='photo'
              label='Photo'
              type='file'
              form={form}
              name='photo'
              fileRef={fileRef}
              setFile={setFile}
              currentUserPhoto={
                user?.imageUrl ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
              icon={<FaImage className='text-gray-500' />}
            />
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md shadow transition-colors duration-300'
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default ProfileForm;
