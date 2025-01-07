import AdminCard from '../../components/admin/AdminCard';
import { Separator } from '../../components/ui/separator';
import { Link, useParams } from 'react-router-dom';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import Spinner from '../../components/Spinner';
import { GetSeasonByLeagueId } from '../../api/getSeasonByLeagueId';
import { GetUserById } from '../../api/getUserById';

const RefereeDashboard = () => {
  const leagueId = useParams().id;
  const { user, loading } = GetUserById();
  const { season, league } = GetSeasonByLeagueId(leagueId);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className='flex flex-col gap-6 p-4 md:p-8'>
        <div>
          <div className='flex items-center justify-between mb-4'>
            <h1 className='text-heading4-medium font-bold text-gray-800'>
              Referee Dashboard
            </h1>
            <p className='text-body1-bold text-muted-foreground'>
              {league} / {season?.name}
            </p>
          </div>
          <Separator />
        </div>

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
      </div>
    </>
  );
};

export default RefereeDashboard;
