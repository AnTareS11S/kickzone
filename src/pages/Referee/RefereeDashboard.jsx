import AdminCard from '../../components/admin/AdminCard';
import { Separator } from '../../components/ui/separator';
import { useParams } from 'react-router-dom';

const RefereeDashboard = () => {
  const leagueId = useParams().id;
  return (
    <>
      <div className='text-heading2-bold mb-4'>Referee Dashboard</div>
      <Separator />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
        <AdminCard
          title='Schedule'
          linkTo={`/dashboard/referee/league/schedule/${leagueId}`}
        />
        <AdminCard
          title='Assign Referee'
          linkTo={`/dashboard/referee/league/assign-referee/${leagueId}`}
        />
        <AdminCard
          title='Results'
          linkTo={`/dashboard/referee/league/results/${leagueId}`}
        />
        <AdminCard
          title='Match Details'
          linkTo={`/dashboard/referee/league/match-details/${leagueId}`}
        />
      </div>
    </>
  );
};

export default RefereeDashboard;
