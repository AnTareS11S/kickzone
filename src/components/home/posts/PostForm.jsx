/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Form } from '../../ui/form';
import FormArea from '../../FormArea';
import { useEffect, useRef, useState } from 'react';
import uploadFile from '../../../lib/uploadFile';
import { Button } from '../../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostValidation } from '../../../lib/validation/PostValidation';
import { useNavigate } from 'react-router-dom';

const PostForm = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      title: '',
      content: '',
      photo: '',
    },
    mode: 'onChange',
  });

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

  const onSubmit = async (formData) => {
    const updatedData = { ...formData, author: currentUser._id };
    try {
      const res = await fetch('/api/post/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      form.reset();
      setUpdateSuccess(true);
      navigate('/');
    } catch (error) {
      console.log('Error creating post: ', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormArea
          id='title'
          label='Title'
          type='text'
          form={form}
          name='title'
        />
        <FormArea
          id='content'
          label='Content'
          type='textarea'
          form={form}
          name='postContent'
        />
        <FormArea
          id='photo'
          label='Photo'
          type='file'
          form={form}
          name='postPhoto'
          fileRef={fileRef}
          setFile={setFile}
        />

        <div className='flex justify-start items-center mt-5'>
          <Button
            type='submit'
            disabled={!form.formState.isValid}
            className='bg-primary-500 text-white'
          >
            Save
          </Button>
          {updateSuccess && <p className='text-green-700 ml-3'>Saved</p>}
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
