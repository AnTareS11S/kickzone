import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { useToast } from '../ui/use-toast';
import FormArea from '../FormArea';
import { Card } from '../ui/card';

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' })
      .max(20, { message: 'Password must not be longer than 20 characters.' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' })
      .max(20, { message: 'Password must not be longer than 20 characters.' }),
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
    <Card className='px-4 py-8'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Change Password</h2>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <FormArea
            id='currentPassword'
            label='Current Password'
            type='password'
            form={form}
            name='currentPassword'
          />
          <FormArea
            id='newPassword'
            label='New Password'
            type='password'
            form={form}
            name='newPassword'
          />
          <FormArea
            id='confirmPassword'
            label='Confirm Password'
            type='password'
            form={form}
            name='confirmPassword'
          />
          <Button
            type='submit'
            className='w-full bg-primary-500 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded'
          >
            Save
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default ChangePassword;
