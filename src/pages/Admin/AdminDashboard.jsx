import AdminCard from '../../components/admin/AdminCard';
import { Separator } from '../../components/ui/separator';

const AdminDashboard = () => {
  return (
    <div className='flex flex-col gap-6 p-4 md:p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-800'>Admin Dashboard</h1>
        <Separator />
      </div>

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
        <AdminCard title='Terms' linkTo='/dashboard/admin/terms' />
        <AdminCard title='Privacy' linkTo='/dashboard/admin/privacy' />
      </div>
    </div>
  );
};

export default AdminDashboard;
