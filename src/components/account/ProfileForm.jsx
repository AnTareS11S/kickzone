import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';

import { useDispatch, useSelector } from 'react-redux';

import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';

import uploadFile from '../../lib/uploadFile';
import FormArea from '../FormArea';
import { updateUserSuccess } from '../../redux/user/userSlice';
import { useToast } from '../ui/use-toast';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(4, {
      message: 'Username must be at least 4 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z.string().email().min(4, { message: 'Email must be valid.' }),
  bio: z
    .string()
    .max(160, {
      message: 'Bio must not be longer than 160 characters.',
    })
    .min(4, {
      message: 'Bio must be at least 4 characters.',
    }),
});

const ProfileForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      bio: currentUser?.bio,
      photo: currentUser?.photo,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const handleFileUpload = async () => {
      if (!file) return;

      await uploadFile(file, setFile, setUploadProgress);

      form.setValue('photo', file);
    };

    handleFileUpload();
  }, [file, form, setFile, setUploadProgress]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [updateSuccess]);

  const onSubmit = async (formData) => {
    const updatedData = { ...formData, photo: form.getValues('photo') };

    try {
      const res = await fetch(`/api/user/edit/${currentUser?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'User profile updated successfully',
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update user profile',
          variant: 'destructive',
        });
      }

      dispatch(updateUserSuccess({ ...currentUser, ...updatedData }));

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
        <FormArea
          id='username'
          label='Username'
          type='text'
          form={form}
          name='username'
        />
        <FormArea
          id='email'
          label='Email'
          type='text'
          form={form}
          name='email'
        />
        <FormArea id='bio' label='Bio' type='textarea' form={form} name='bio' />
        <FormArea
          id='photo'
          label='Photo'
          type='file'
          form={form}
          name='photo'
          fileRef={fileRef}
          setFile={setFile}
          currentUserPhoto={currentUser?.photo}
          uploadProgress={uploadProgress}
        />

        <div className='flex justify-start items-center'>
          <Button type='submit' className='bg-primary-500 hover:bg-purple-500'>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
