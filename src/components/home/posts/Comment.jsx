import { useForm } from 'react-hook-form';
import { CommentValidation } from '../../../lib/validation/PostValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../../ui/form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useSelector } from 'react-redux';

const Comment = ({ postId, currentUserImg, setUpdateSuccess }) => {
  const { currentUser } = useSelector((state) => state.user);

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      post: '',
    },
  });

  const onSubmit = async (formData) => {
    const updatedData = {
      author: currentUser,
      commentContent: formData.post,
    };

    try {
      const res = await fetch(`/api/post/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data!');
      }
      setUpdateSuccess(true);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='comment-form'>
        <FormField
          control={form.control}
          name='post'
          render={({ field }) => (
            <FormItem className='flex gap-3 w-full items-center ml-7'>
              <FormLabel>
                <img
                  src={currentUserImg}
                  alt='Profile image'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  placeholder='Comment...'
                  className='text-dark-1 outline-none no-focus'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='comment-form_btn mt-2'
          disabled={!form.formState.isValid}
          onClick={() => {
            form.formState.isValid && setUpdateSuccess(false);
          }}
        >
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
