import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../../components/OAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Header from '../../components/Header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '../../components/ui/form';
import FormArea from '../../components/FormArea';
import { signUpFormSchema } from '../../lib/validation/AuthFormSchema';
import { useToast } from '../../components/ui/use-toast';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(signUpFormSchema()),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (formData) => {
    try {
      const usernameExists = await fetch(
        `/api/auth/check-username?username=${formData.username}`
      );

      const emailExists = await fetch(
        `/api/auth/check-email?email=${formData.email}`
      );

      const usernameData = await usernameExists.json();
      const emailData = await emailExists.json();

      if (usernameData.exists) {
        form.setError('username', {
          type: 'manual',
          message: 'Username already exists',
        });
        setLoading(false);
        return;
      }

      if (emailData.exists) {
        form.setError('email', {
          type: 'manual',
          message: 'Email already exists',
        });
        setLoading(false);
        return;
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: 'Account created successfully',
          description: 'You can now sign in to your account',
        });

        setLoading(true);
        navigate('/sign-in');
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to create account',
          variant: 'destructive',
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className='flex flex-col p-3 max-w-lg mx-auto mt-28'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader className='space-y-1'>
                <CardTitle className='text-2xl'>Create an account</CardTitle>
                <CardDescription>
                  Enter your credentials below to create your account
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-1'>
                <div className='grid grid-cols-1'>
                  <OAuth />
                </div>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                  </div>
                  <div className='relative py-3 flex justify-center text-xs uppercase'>
                    <span className='bg-background text-muted-foreground'>
                      Or continue with
                    </span>
                  </div>
                </div>
                <div>
                  <FormArea
                    id='username'
                    label='Username'
                    type='text'
                    form={form}
                    name='username'
                  />
                </div>
                <div>
                  <FormArea
                    id='email'
                    label='Email'
                    type='email'
                    form={form}
                    name='email'
                    placeholder='m@example.com'
                  />
                </div>
                <div>
                  <FormArea
                    id='password'
                    label='Password'
                    type='password'
                    form={form}
                    name='password'
                  />
                </div>
                <div>
                  <FormArea
                    id='confirmPassword'
                    label='Confirm Password'
                    type='password'
                    form={form}
                    name='confirmPassword'
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type='submit'
                  className='w-full bg-primary-500 hover:bg-purple-500'
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create account'}
                </Button>
              </CardFooter>
              <div className='flex items-center justify-center mb-4'>
                <span className='text-gray-600 px-2'>
                  Already have an account?
                </span>
                <Link to='/sign-in' className='text-blue-700 underline'>
                  Sign in
                </Link>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Signup;
