import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Form } from '../../ui/form';
import FormArea from '../../FormArea';
import { useRef, useState } from 'react';
import { Button } from '../../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { postFormSchema } from '../../../lib/validation/PostValidation';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../ui/card';
import { FaEdit } from 'react-icons/fa';

const PostForm = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(postFormSchema(false)),
    defaultValues: {
      title: '',
      postContent: '',
      postPhoto: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (formData) => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('postContent', formData.postContent);
    data.append('postPhoto', file);
    data.append('author', currentUser._id);
    try {
      const res = await fetch('/api/post/add', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data!');
      }
      form.reset();
      navigate('/');
    } catch (error) {
      console.log('Error creating post: ', error);
    }
  };

  return (
    <div className='container mx-auto py-8'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className='bg-white shadow-md rounded-lg'>
            <CardHeader className='bg-gray-100 p-4 rounded-t-lg flex items-center'>
              <FaEdit className='text-gray-500 mr-2' />
              <h2 className='text-lg font-semibold'>Create Post</h2>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='mb-6'>
                <FormArea
                  id='title'
                  label='Title'
                  type='text'
                  form={form}
                  name='title'
                  className='w-full'
                />
              </div>
              <div className='mb-6'>
                <FormArea
                  id='content'
                  label='Content'
                  type='textarea'
                  form={form}
                  name='postContent'
                  className='w-full'
                />
              </div>
              <div className='mb-6 w-fit'>
                <FormArea
                  id='postPhoto'
                  label='Photo'
                  type='file'
                  form={form}
                  name='postPhoto'
                  fileRef={fileRef}
                  setFile={setFile}
                  className='w-full'
                />
              </div>
              <div className='flex justify-end'>
                <Button
                  type='submit'
                  className='bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md shadow transition-colors duration-300'
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default PostForm;
