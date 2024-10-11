import { Link } from 'react-router-dom';
import AdminCard from '../../components/admin/AdminCard';
import { useFetchUserById } from '../../components/hooks/useFetchUserById';
import Spinner from '../../components/Spinner';
import { Separator } from '../../components/ui/separator';
import { ArrowRightIcon } from '@radix-ui/react-icons';

const AdminDashboard = () => {
  const { user, loading } = useFetchUserById();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col gap-6 p-4 md:p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-800'>Admin Dashboard</h1>
        <Separator />
      </div>

      {user.isProfileFilled ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
          <AdminCard title='Users' linkTo='/dashboard/admin/users' />
          <AdminCard title='Players' linkTo='/dashboard/admin/players' />
          <AdminCard title='Coaches' linkTo='/dashboard/admin/coaches' />
          <AdminCard title='Referees' linkTo='/dashboard/admin/referees' />
          <AdminCard title='Sponsors' linkTo='/dashboard/admin/sponsors' />
          <AdminCard title='Teams' linkTo='/dashboard/admin/teams' />
          <AdminCard title='Leagues' linkTo='/dashboard/admin/leagues' />
          <AdminCard title='Stadiums' linkTo='/dashboard/admin/stadiums' />
          <AdminCard title='Positions' linkTo='/dashboard/admin/positions' />
          <AdminCard title='Countries' linkTo='/dashboard/admin/countries' />
          <AdminCard title='Seasons' linkTo='/dashboard/admin/seasons' />
          <AdminCard title='About' linkTo='/dashboard/admin/about' />
          <AdminCard title='Terms' linkTo='/dashboard/admin/terms' />
          <AdminCard title='Privacy' linkTo='/dashboard/admin/privacy' />
          <AdminCard title='Contact' linkTo='/dashboard/admin/contact' />
          <AdminCard title='FAQ' linkTo='/dashboard/admin/faq' />
        </div>
      ) : (
        <div className='text-gray-800 text-lg text-center'>
          <p className='mb-4'>
            Please fill in your profile to access the dashboard.
          </p>
          <Link
            to='/user/admin/profile'
            className='inline-flex items-center justify-center px-4 py-2 bg-primary-500 hover:bg-purple-500 text-white rounded-md transition-colors duration-300'
          >
            <span>Complete Profile</span>
            <ArrowRightIcon className='ml-2 h-5 w-5' />
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
