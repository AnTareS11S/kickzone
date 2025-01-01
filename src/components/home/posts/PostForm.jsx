import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FaEdit } from 'react-icons/fa';

import { Form } from '../../ui/form';
import { Button } from '../../ui/button';
import { Card, CardHeader, CardContent } from '../../ui/card';
import FormArea from '../../FormArea';
import { postFormSchema } from '../../../lib/validation/PostValidation';
import { useToast } from '../../ui/use-toast';

const PostForm = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { toast } = useToast();
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

    setLoading(true);
    try {
      const res = await fetch('/api/post/add', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Post created successfully',
        });
        form.reset();
        navigate('/');
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to create post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  return (
    <div className='max-w-7xl mx-auto py-8 px-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className='bg-white shadow-lg rounded-xl overflow-hidden'>
            <CardHeader className='bg-gradient-to-r from-primary-500 to-primary-600 p-6'>
              <div className='flex items-center text-white'>
                <FaEdit className='text-2xl mr-3' />
                <h2 className='text-2xl font-bold'>Create New Post</h2>
              </div>
            </CardHeader>
            <CardContent className='p-6 space-y-6'>
              <FormArea
                id='title'
                label='Title'
                type='text'
                form={form}
                name='title'
                className='w-full'
                placeholder='Enter post title'
              />
              <FormArea
                id='content'
                label='Content'
                type='textarea'
                form={form}
                name='postContent'
                className='w-full'
                placeholder='Write your post content here...'
                rows={6}
              />
              <div className='space-y-2'>
                <div className='flex items-center space-x-4'>
                  <FormArea
                    id='postPhoto'
                    label='Photo'
                    type='file'
                    form={form}
                    name='postPhoto'
                    fileRef={fileRef}
                    onChange={handleFileChange}
                    setFile={setFile}
                    className='w-full'
                  />
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt='Preview'
                      className='w-20 h-20 object-cover rounded-lg'
                    />
                  )}
                </div>
              </div>
              <div className='flex justify-end'>
                <Button
                  type='submit'
                  className='bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105'
                  disabled={loading}
                >
                  {loading ? 'Publishing...' : 'Publish Post'}
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
