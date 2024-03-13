/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import SquadManagement from '../../components/coach/SquadManagement';
import { Separator } from '../../components/ui/separator';
import Spinner from '../../components/Spinner';
import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';
import BackButton from '../../components/BackButton';

const CoachTeamView = () => {
  const coach = useFetchCoachByUserId();
  const [team, setTeam] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchTeam = async () => {
    try {
      if (!coach?.currentTeam) {
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/team/${coach?.currentTeam}`);
      if (!res.ok) {
        throw new Error('Failed to fetch team data!');
      }
      const data = await res.json();

      setTeam(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [coach?.currentTeam]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Team</div>
        <p className='text-sm text-muted-foreground'>Manage your team squad.</p>
      </div>
      <div className='flex items-center justify-between'>
        <h4 className='text-heading3-bold text-gray-800'>Team: {team?.name}</h4>
        <p className='text-sm text-muted-foreground'>
          Coach: {coach?.name} {coach?.surname}{' '}
        </p>
      </div>
      <Separator />
      <SquadManagement data={team} />
    </div>
  );
};

export default CoachTeamView;
