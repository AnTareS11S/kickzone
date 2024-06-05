import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../components/ui/form';
import FormArea from '../components/FormArea';
import { useToast } from '../components/ui/use-toast';
import { useSelector } from 'react-redux';
import { onboardingFormSchema } from '../lib/validation/AuthFormSchema';
import { Button } from '../components/ui/button';

const Onboarding = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(onboardingFormSchema()),
    defaultValues: {
      wantedRole: '',
      username: '',
      bio: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        username: currentUser?.username || '',
        bio: currentUser?.bio,
      });
    }
  }, [currentUser, form]);

  const onSubmit = async (formData) => {
    try {
      const userId = currentUser?._id;
      const res = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (res.ok) {
        toast({
          title: 'Onboarding completed',
          description: 'Your profile is now updated',
        });
        setLoading(true);
        navigate('/');
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to complete onboarding',
          variant: 'destructive',
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-4 py-8 bg-gray-100 sm:px-6 lg:px-8'>
      <div className='max-w-xl w-full bg-white rounded-lg shadow-lg p-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='mb-6'>
              <h1 className='text-2xl font-bold text-gray-800'>
                Update Your Profile
              </h1>
              <p className='text-gray-600'>
                Enter the new details to update your profile and choose your
                role in the platform
              </p>
            </div>
            <div className='grid gap-4'>
              <div>
                <FormArea
                  id='username'
                  label='Username'
                  type='text'
                  form={form}
                  name='username'
                  placeholder='Enter username'
                />
              </div>
              <div>
                <FormArea
                  id='bio'
                  label='Bio'
                  type='text'
                  form={form}
                  name='bio'
                  placeholder='Enter bio'
                />
              </div>
              <div>
                <FormArea
                  id='wantedRole'
                  label='Wanted role'
                  type='select'
                  form={form}
                  items={['Player:1', 'Coach:2', 'Referee:3']}
                  name='wantedRole'
                  placeholder='Select role'
                />
              </div>
            </div>
            <div className='flex justify-end mt-6'>
              <Button
                type='submit'
                className='px-4 py-2 text-white bg-primary-500 rounded-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'
                aria-label={loading ? 'Loading...' : 'Update Profile'}
              >
                {loading ? 'Loading...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Onboarding;
