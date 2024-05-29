import { useForm } from 'react-hook-form';
import { CommentValidation } from '../../../lib/validation/PostValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../../ui/form';
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex items-center gap-4 mb-4'
      >
        <div className='w-12 h-12 rounded-full overflow-hidden'>
          <img
            src={currentUserImg}
            alt='Profile'
            className='w-full h-full object-cover'
          />
        </div>
        <FormField
          control={form.control}
          name='post'
          render={({ field }) => (
            <FormItem className='flex-grow'>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Write a comment...'
                  className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='ml-2 bg-primary-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded'
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
