import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { z } from 'zod';
import { useToast } from '../ui/use-toast';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    newPassword: z
      .string()
      .min(6, {
        message: 'Password must be at least 6 characters.',
      })
      .max(20, {
        message: 'Password must not be longer than 20 characters.',
      }),

    confirmPassword: z
      .string()
      .min(6, {
        message: 'Password must be at least 6 characters.',
      })
      .max(20, {
        message: 'Password must not be longer than 20 characters.',
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const ChangePassword = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/user/change-password/${currentUser._id}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await res.json();
      if (response.statusCode === 403) {
        form.setError('currentPassword', {
          type: 'manual',
          message: 'Invalid password',
        });
        return;
      }
      if (res.status === 200) {
        toast({
          title: 'Success!',
          description: 'Password updated successfully',
        });
        form.reset();
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='currentPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  id='currentPassword'
                  className='w-full'
                  {...field}
                  {...form.register('currentPassword')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  id='newPassword'
                  className='w-full'
                  {...field}
                  {...form.register('newPassword')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  id='confirmPassword'
                  className='w-full'
                  {...field}
                  {...form.register('confirmPassword')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='btn bg-primary-500 hover:bg-purple-500'
        >
          Save
        </Button>
      </form>
    </Form>
  );
};

export default ChangePassword;
