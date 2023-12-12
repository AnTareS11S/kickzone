/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';

const Signin = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='flex flex-col p-3 max-w-lg mx-auto mt-10'>
      <form
        className='flex justify-center items-center'
        onSubmit={handleSubmit}
      >
        <Card>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl'>Log in to FutbolsitPro</CardTitle>
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
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                onChange={handleChange}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className='w-full' disabled={loading}>
              {loading ? 'Loading...' : 'Log In'}
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
    </div>
  );
};

export default Signin;
