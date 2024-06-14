import AdminCard from '../../components/admin/AdminCard';
import { Separator } from '../../components/ui/separator';
import { Link, useParams } from 'react-router-dom';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useFetchUserById } from '../../components/hooks/useFetchUserById';
import Spinner from '../../components/Spinner';
import { useFetchSeasonByLeagueId } from '../../components/hooks/useFetchSeasonByLeagueId';

const RefereeDashboard = () => {
  const leagueId = useParams().id;
  const { user, loading } = useFetchUserById();
  const { season, league } = useFetchSeasonByLeagueId(leagueId);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className='text-heading2-bold mb-4 flex flex-row justify-between items-center'>
        Referee Dashboard
        <div>
          <p className='text-body1-bold text-muted-foreground'>
            {league} / {season?.name}
          </p>
        </div>
      </div>
      <Separator />
      {user?.isProfileFilled ? (
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
      ) : (
        <div className='text-gray-800 text-lg text-center'>
          <p className='mb-4'>
            Please fill in your profile to access the dashboard.
          </p>
          <Link
            to='/user/referee/profile'
            className='inline-flex items-center justify-center px-4 py-2 bg-primary-500 hover:bg-purple-500 text-white rounded-md transition-colors duration-300'
          >
            <span>Complete Profile</span>
            <ArrowRightIcon className='ml-2 h-5 w-5' />
          </Link>
        </div>
      )}
    </>
  );
};

export default RefereeDashboard;
