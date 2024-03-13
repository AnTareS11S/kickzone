import AdminCard from '../../components/admin/AdminCard';
import { Separator } from '../../components/ui/separator';
import { useLocation } from 'react-router-dom';

const RefereeDashboard = () => {
  const pathname = useLocation().pathname.split('/')[4];
  return (
    <>
      <div className='text-heading2-bold mb-4'>Referee Dashboard</div>
      <Separator />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
        <AdminCard
          title='Schedule'
          linkTo={`/dashboard/referee/league/schedule/${pathname}`}
        />
        <AdminCard
          title='Results'
          linkTo={`/dashboard/referee/league/results/${pathname}`}
        />
      </div>
    </>
  );
};

export default RefereeDashboard;
