/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
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
            <CardTitle className='text-2xl'>Create an account</CardTitle>
            <CardDescription>
              Enter your credentials below to create your account
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
              <Label htmlFor='username'>Username</Label>
              <Input id='username' type='text' onChange={handleChange} />
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
              {loading ? 'Loading...' : 'Create account'}
            </Button>
          </CardFooter>
          <div className='flex items-center justify-center mb-4'>
            <span className='text-gray-600 px-2'>Already have an account?</span>
            <Link to='/sign-in' className='text-blue-700 underline'>
              Sign in
            </Link>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default Signup;
