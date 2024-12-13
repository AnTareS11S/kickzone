import SquadManagement from '../../components/coach/SquadManagement';
import { Separator } from '../../components/ui/separator';
import Spinner from '../../components/Spinner';
import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';
import BackButton from '../../components/BackButton';
import { useEffect, useState } from 'react';

const CoachTeamView = () => {
  const { coach } = useFetchCoachByUserId();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coach?.currentTeam) {
      fetchTeamById(coach?.currentTeam);
    }
  }, [coach]);

  const fetchTeamById = async (id) => {
    try {
      const res = await fetch(`/api/team/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch team data!');
      }
      const data = await res.json();

      setTeam(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Team</div>
        <p className='text-sm text-muted-foreground'>Manage your team squad.</p>
      </div>

      <Separator className='mb-6' />
      {coach?.currentTeam ? (
        <>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold text-gray-800'>
              Team: {team?.name}
            </h2>
            <p className='text-gray-600'>
              Coach: {coach?.name} {coach?.surname}
            </p>
          </div>
          <SquadManagement data={team} />
        </>
      ) : (
        <p className='text-lg text-gray-800 text-center'>
          You are not assigned to any team yet.
        </p>
      )}
    </div>
  );
};

export default CoachTeamView;
