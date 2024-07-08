import { useNavigate, useParams } from 'react-router-dom';
import { useFetchPostById } from '../components/hooks/useFetchPostById';
import Spinner from '../components/Spinner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { postFormSchema } from '../lib/validation/PostValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import FormArea from '../components/FormArea';
import { Form } from '../components/ui/form';
import { useToast } from '../components/ui/use-toast';
import { FaImage, FaTimes } from 'react-icons/fa';

const PostEdit = () => {
  const postId = useParams().id;
  const { post, loading } = useFetchPostById(postId);
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isComment = post.parentId ? true : false;

  const form = useForm({
    resolver: zodResolver(postFormSchema(true)),
    defaultValues: {
      title: post?.title || '',
      postContent: post?.postContent || '',
      postPhoto: post?.imageUrl || '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    form.reset({
      title: post?.title || '',
      postContent: post?.postContent || '',
      postPhoto: post?.photo || '',
    });
  }, [post, form]);

  const onSubmit = async (formData) => {
    const data = new FormData();

    data.append('title', formData?.title);
    data.append('postContent', formData?.postContent);
    data.append('postPhoto', file || post?.postPhoto);

    try {
      const res = await fetch(`/api/post/edit/${postId}`, {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Post updated successfully',
        });
        form.reset();
        navigate('/');
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log('Error updating post: ', error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='container mx-auto py-8 px-4 max-w-4xl'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType='multipart/form-data'
        >
          <Card className='bg-white shadow-xl rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl'>
            <CardContent className='p-6 space-y-6'>
              <CardContent className='p-6 space-y-6'>
                {!isComment && (
                  <FormArea
                    id='title'
                    type='text'
                    label='Title'
                    form={form}
                    name='title'
                    placeholder='Enter post title'
                    className='mb-4 text-lg font-semibold'
                  />
                )}
                <FormArea
                  id='postContent'
                  type='textarea'
                  label='Content'
                  form={form}
                  name='postContent'
                  placeholder='Write your post content here...'
                  className={`w-full ${isComment ? 'h-40' : 'h-60'} text-base`}
                />
                {!isComment && post.postPhoto && (
                  <div className='space-y-4'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Post Image
                    </label>
                    <div className='relative h-80 w-full'>
                      <img
                        src={post.imageUrl}
                        alt='Post'
                        className='object-cover object-center w-full h-full rounded-md'
                      />
                    </div>
                    <FormArea
                      id='photo'
                      type='file'
                      label={'Photo'}
                      form={form}
                      name='postPhoto'
                      fileRef={fileRef}
                      setFile={setFile}
                      icon={<FaImage className='text-gray-500' />}
                    />
                  </div>
                )}
              </CardContent>
            </CardContent>
            <CardFooter className='bg-gray-50 px-6 py-4'>
              <div className='flex justify-end gap-4 w-full'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => navigate(-1)}
                  className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='px-4 py-2 text-white bg-primary-500 rounded-md shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default PostEdit;
