/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

import { app } from '../../firebase';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { useDispatch, useSelector } from 'react-redux';

import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';

import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from '../../redux/user/userSlice';

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
  const [file, setFile] = useState(undefined);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
      bio: currentUser.bio,
      photo: currentUser.photo,
    },
    mode: 'onChange',
  });

  const dispatch = useDispatch();
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
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, `avatars/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          form.setValue('photo', downloadURL);
        });
      }
    );
  };

  const onSubmit = async (formData) => {
    const updatedData = { ...formData, photo: form.getValues('photo') };
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/edit/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 max-w-screen-md mx-auto'
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  id='username'
                  className='w-full'
                  {...form.register('username')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id='email'
                  type='email'
                  className='w-full'
                  {...form.register('email')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us a little bit about yourself'
                  className='resize-none w-full'
                  id='bio'
                  {...form.register('bio')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='photo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <div className='flex items-center'>
                  <img
                    src={currentUser.photo}
                    alt='user'
                    className='w-24 h-24 rounded-full object-cover mt-2 self-center mx-auto cursor-pointer'
                    onClick={() => fileRef.current.click()}
                  />
                  <Input
                    id='photo'
                    type='file'
                    ref={fileRef}
                    accept='image/*'
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-center'>
          <Button type='submit' disabled={!form.formState.isValid}>
            Update profile
          </Button>
          {updateSuccess && <p className='text-green-700 ml-3'>Saved</p>}
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
