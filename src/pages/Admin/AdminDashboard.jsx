import AdminCard from '../../components/admin/AdminCard';

import { Separator } from '../../components/ui/separator';

const AdminDashboard = () => {
  return (
    <>
      <div className='text-heading2-bold mb-4'>Admin Dashboard</div>
      <Separator />
      <div className='grid grid-cols-6 gap-4 max-2xl:grid-cols-3 max-lg:grid-cols-3 max-sm:grid-cols-1 max-md:grid-cols-2'>
        <AdminCard title='Users' linkTo='/dashboard/admin/users' />
        <AdminCard title='Teams' linkTo='/dashboard/admin/teams' />
        <AdminCard title='Leagues' linkTo='/dashboard/admin/leagues' />
        <AdminCard title='Players' linkTo='/dashboard/admin/players' />
        <AdminCard title='Countries' linkTo='/dashboard/admin/countries' />
        <AdminCard title='Stadiums' linkTo='/dashboard/admin/stadiums' />
        <AdminCard title='Positions' linkTo='/dashboard/admin/positions' />
        <AdminCard title='Coaches' linkTo='/dashboard/admin/coaches' />
      </div>
    </>
  );
};

export default AdminDashboard;
