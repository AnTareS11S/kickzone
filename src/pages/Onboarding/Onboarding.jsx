import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../components/ui/form';
import FormArea from '../../components/FormArea';
import { useToast } from '../../components/ui/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { onboardingFormSchema } from '../../lib/validation/AuthFormSchema';
import { Button } from '../../components/ui/button';
import { fetchUserData, updateOnboarding } from '../../redux/user/userSlice';

const Onboarding = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const userId = currentUser?._id;
      const res = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (res.ok) {
        dispatch(updateOnboarding(true));

        await dispatch(fetchUserData(userId));

        toast({
          title: 'Onboarding completed',
          description: 'Your profile has been successfully updated!',
        });
        setTimeout(() => navigate('/'), 1500);
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error) {
      toast({
        title: 'Error!',
        description:
          error.message || 'Failed to complete onboarding. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-xl w-full bg-white rounded-xl shadow-lg p-8 transform transition duration-500 hover:shadow-2xl'>
        <h1 className='text-3xl font-semibold text-center text-gray-800 mb-6'>
          Update Your Profile
        </h1>
        <p className='text-center text-gray-500 mb-8'>
          Fill in the details below to update your profile and choose your role.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-6'>
              <div>
                <FormArea
                  id='username'
                  label='Username'
                  type='text'
                  form={form}
                  name='username'
                  placeholder='Enter your username'
                />
              </div>
              <div>
                <FormArea
                  id='bio'
                  label='Bio'
                  type='text'
                  form={form}
                  name='bio'
                  placeholder='Tell us about yourself'
                />
              </div>
              <div>
                <FormArea
                  id='wantedRole'
                  label='Role'
                  type='select'
                  form={form}
                  items={[
                    { id: 1, name: 'Player' },
                    { id: 2, name: 'Coach' },
                    { id: 3, name: 'Referee' },
                  ]}
                  name='wantedRole'
                  placeholder='Select your role'
                />
              </div>
            </div>
            <div className='flex justify-end mt-8'>
              <Button
                type='submit'
                className={`px-6 py-3 text-white bg-primary-500 rounded-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Onboarding;
