import AdminCard from '../../components/admin/AdminCard';
import { Separator } from '../../components/ui/separator';

const CoachDashboard = () => {
  return (
    <>
      <div className='text-heading2-bold mb-4'>Coach Dashboard</div>
      <Separator />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
        <AdminCard title='Team' linkTo='/dashboard/coach/team' />
        <AdminCard title='Training' linkTo='/dashboard/coach/training' />
        <AdminCard
          title='Training Type'
          linkTo='/dashboard/coach/training-type'
        />
      </div>
    </>
  );
};

export default CoachDashboard;
