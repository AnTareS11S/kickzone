import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from '../../redux/user/userSlice';
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
import { Form } from '../../components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signInFormSchema } from '../../lib/validation/AuthFormSchema';
import FormArea from '../../components/FormArea';
import { useToast } from '../../components/ui/use-toast';
import { useState } from 'react';
import { formatRemainingTime } from '../../lib/utils';
import { FaClock, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { TbLoader2 } from 'react-icons/tb';

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [banInfo, setBanInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(signInFormSchema()),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const emailExists = await fetch(
        `/api/auth/check-email?email=${formData.email}`
      );

      const emailData = await emailExists.json();

      if (!emailData.exists) {
        form.setError('email', {
          type: 'manual',
          message: 'Email does not exist',
        });
        return;
      }

      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.statusCode === 405 && data.banInfo) {
        setBanInfo(data.banInfo);
      }

      if (data.statusCode === 403) {
        form.setError('password', {
          type: 'manual',
          message: 'Invalid password',
        });
        return;
      }

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Logged in successfully',
        });
        setLoading(false);

        dispatch(signInSuccess(data));
        if (!data.isOnboardingCompleted) {
          navigate('/onboarding');
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to log in',
          variant: 'destructive',
        });
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className='flex flex-col p-3 max-w-lg mx-auto mt-28'>
        {banInfo && (
          <>
            <div className='mb-6'>
              <Alert variant='destructive'>
                <FaExclamationTriangle className='h-4 w-4' />
                <AlertTitle className='flex items-center gap-2'>
                  <FaInfoCircle /> Account Suspended
                </AlertTitle>
                <AlertDescription className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <FaClock />
                    <span>
                      Ban expires in: {formatRemainingTime(banInfo.endDate)}
                    </span>
                  </div>
                  <div>
                    <strong>Reason:</strong> {banInfo.reason}
                  </div>
                  {banInfo.endDate && (
                    <div>
                      <strong>Until:</strong>{' '}
                      {new Date(banInfo.endDate).toLocaleString()}
                    </div>
                  )}
                  {banInfo.bannedBy && (
                    <div>
                      <strong>Banned by:</strong> {banInfo.bannedBy.username}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          </>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader className='space-y-1'>
                <CardTitle className='text-2xl'>Log in to KickZone</CardTitle>
                <CardDescription>
                  Enter your credentials below to log in to your account
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-4'>
                <div className='grid grid-cols-1 gap-6'>
                  <OAuth />
                </div>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background text-muted-foreground'>
                      Or continue with
                    </span>
                  </div>
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
              </CardContent>
              <CardFooter>
                <Button
                  type='submit'
                  className='w-full bg-primary-500 hover:bg-purple-500'
                  disabled={!!banInfo || loading}
                >
                  {loading ? (
                    <>
                      <TbLoader2 className='mr-2 h-4 w-4 animate-spin' />
                      <span>Login in...</span>
                    </>
                  ) : (
                    <span>Log In</span>
                  )}
                </Button>
              </CardFooter>
              <div className='flex items-center justify-center mb-4'>
                <span className='text-gray-600 px-2'>Not a member yet?</span>
                <Link to='/sign-up' className='text-blue-700 underline'>
                  Sign up
                </Link>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Signin;
