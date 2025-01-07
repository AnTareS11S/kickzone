import AdminCard from '../../components/admin/AdminCard';
import { Separator } from '../../components/ui/separator';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { useFetchUserById } from '../../components/hooks/useFetchUserById';
import Spinner from '../../components/Spinner';

const CoachDashboard = () => {
  const { user, loading } = useFetchUserById();

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className='flex flex-col gap-6 p-4 md:p-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-heading4-medium font-bold text-gray-800'>
            Coach Dashboard
          </h1>
          <Separator />
        </div>
        {user?.isProfileFilled ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
            <AdminCard title='Team' linkTo='/dashboard/coach/team' />
            <AdminCard
              title='Team Forum'
              linkTo='/dashboard/coach/team-forum'
            />
            <AdminCard title='Training' linkTo='/dashboard/coach/training' />
            <AdminCard
              title='Training Type'
              linkTo='/dashboard/coach/training-type'
            />
            <AdminCard
              title='Team Equipment'
              linkTo='/dashboard/coach/team-equipment'
            />
          </div>
        ) : (
          <div className='text-gray-800 text-lg text-center'>
            <p className='mb-4'>
              Please fill in your profile to access the dashboard.
            </p>
            <Link
              to='/user/coach/profile'
              className='inline-flex items-center justify-center px-4 py-2 bg-primary-500 hover:bg-purple-500 text-white rounded-md transition-colors duration-300'
            >
              <span>Complete Profile</span>
              <ArrowRightIcon className='ml-2 h-5 w-5' />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CoachDashboard;
