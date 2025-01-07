import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { CommentValidation } from '../lib/validation/PostValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Form } from '../components/ui/form';
import FormArea from '../components/FormArea';
import { Button } from '../components/ui/button';
import Spinner from '../components/Spinner';
import { GetPostById } from '../api/getPostById';

const CommentEdit = () => {
  const commentId = useParams().id;
  const { post, loading } = GetPostById(commentId);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      post: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    form.reset({
      post: post?.postContent,
    });
  }, [post, form]);

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/post/comment/edit/${commentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Comment updated successfully',
        });
        navigate(-1);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update comment',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className='flex flex-col justify-between h-full'>
          <div className=' p-4 '>
            <FormArea
              id='post'
              type='textarea'
              label='Comment'
              form={form}
              name='post'
              placeholder='Comment...'
              className='w-full h-20'
            />
          </div>
          <div className='flex justify-end items-center p-4 gap-4'>
            <Button
              type='submit'
              className='bg-primary-500 text-white w-full md:w-auto hover:bg-purple-500'
            >
              Save
            </Button>
            <Button
              type='button'
              className='bg-red-600 text-white w-full md:w-auto hover:bg-red-500'
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default CommentEdit;
