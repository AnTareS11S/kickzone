import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import FormArea from '../FormArea';
import { useToast } from '../ui/use-toast';
import Spinner from '../Spinner';
import {
  FaUserAlt,
  FaEnvelope,
  FaInfoCircle,
  FaImage,
  FaUserCog,
  FaQuestionCircle,
} from 'react-icons/fa';
import { Card } from '../ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { GetUserById } from '../../api/getUserById';

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
  wantedRole: z.string(),
});

const ProfileForm = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const [isChanged, setIsChanged] = useState(false);
  const { user, loading } = GetUserById(isChanged);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      photo: '',
      wantedRole: '',
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
        wantedRole: user?.role || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isChanged]);

  const onSubmit = async (formData) => {
    const data = new FormData();
    data.append('photo', file || user?.photo);
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('bio', formData.bio);
    data.append('wantedRole', formData.wantedRole);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/add/${user?._id}`,
        {
          method: 'POST',
          credentials: 'include',
          body: data,
        }
      );
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
    <Card className='p-6 bg-white shadow-md rounded-lg'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormArea
              id='username'
              label='Username'
              type='text'
              form={form}
              name='username'
              icon={<FaUserAlt className='text-gray-500' />}
            />
            <div className='relative'>
              <FormArea
                id='wantedRole'
                label='Role'
                type='select'
                form={form}
                items={[
                  { id: 1, name: 'Player' },
                  { id: 2, name: 'Coach' },
                  { id: 3, name: 'Referee' },
                ]}
                name='wantedRole'
                placeholder={user?.role || 'Select role'}
                icon={<FaUserCog className='text-gray-500' />}
              />
              <div className='absolute top-0 right-0 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full cursor-pointer group'>
                <HoverCard>
                  <HoverCardTrigger>
                    <FaQuestionCircle className='text-gray-500' />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    You can change your role here and wait for an admin to
                    approve it.
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </div>
          <FormArea
            id='email'
            label='Email'
            type='email'
            form={form}
            name='email'
            icon={<FaEnvelope className='text-gray-500' />}
          />
          <FormArea
            id='bio'
            label='Bio'
            type='textarea'
            form={form}
            name='bio'
            icon={<FaInfoCircle className='text-gray-500' />}
          />
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
