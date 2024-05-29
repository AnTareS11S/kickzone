import { useNavigate, useParams } from 'react-router-dom';
import { useFetchPostById } from '../components/hooks/useFetchPostById';
import Spinner from '../components/Spinner';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { postFormSchema } from '../lib/validation/PostValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import FormArea from '../components/FormArea';
import { Form } from '../components/ui/form';
import { useToast } from '../components/ui/use-toast';
import { FaImage } from 'react-icons/fa';

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
    <div className='container mx-auto py-8'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType='multipart/form-data'
        >
          <Card className='bg-white shadow-lg rounded-lg overflow-hidden'>
            <CardContent className='p-6'>
              <div className='flex flex-col md:flex-row gap-6'>
                <div
                  className={`flex-1 ${isComment ? 'md:w-full' : 'md:w-1/2'}`}
                >
                  {post.postPhoto && !isComment && (
                    <div className='relative mb-4'>
                      <img
                        src={post.imageUrl}
                        alt='postPhoto'
                        className='object-contain w-full h-auto rounded-lg'
                      />
                      <div className='w-fit'>
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
                    </div>
                  )}
                </div>
                <div
                  className={`flex-1 ${isComment ? 'md:w-full' : 'md:w-1/2'}`}
                >
                  {!isComment && (
                    <FormArea
                      id='title'
                      type='text'
                      label={'Title'}
                      form={form}
                      name='title'
                      placeholder='Title'
                      className='mb-4'
                    />
                  )}
                  <FormArea
                    id='postContent'
                    type='textarea'
                    label={'Content'}
                    form={form}
                    name='postContent'
                    placeholder='Content'
                    className={`w-full ${isComment ? 'h-40' : ''}`}
                  />
                </div>
              </div>
            </CardContent>
            <div className='p-4 flex justify-end gap-4'>
              <Button
                type='submit'
                className='bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow transition-colors duration-300'
              >
                Save
              </Button>
              <Button
                type='button'
                className='bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow transition-colors duration-300'
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default PostEdit;
