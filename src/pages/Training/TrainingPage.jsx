import { useFetchCoachById } from '../../components/hooks/useFetchCoachById';
import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';
import { useFetchPlayerById } from '../../components/hooks/useFetchPlayerById';
import { useFetchTeamById } from '../../components/hooks/useFetchTeamById';
import { useFetchTrainingsByCoachId } from '../../components/hooks/useFetchTrainingsByCoachId';

import Spinner from '../../components/Spinner';
import ActiveTrainings from '../../components/training/ActiveTrainings';
import { Card } from '../../components/ui/card';

const TrainingPage = () => {
  const player = useFetchPlayerById();
  const coachId = useFetchCoachByUserId();
  const team = useFetchTeamById(player?.currentTeam || coachId?.currentTeam);
  const coach = useFetchCoachById(team?.coach?.split(':')[1]);
  const { trainings, loading } = useFetchTrainingsByCoachId(
    coach?._id || coachId?._id
  );

  const activeTrainings = trainings?.filter((training) => training?.isActive);

  const completedTrainings = trainings?.filter(
    (training) => training?.isCompleted
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Card className='p-6  shadow-md space-y-6'>
        <div className='flex items-center justify-between space-x-4'>
          <p className='text-heading4-medium font-semibold'>{team?.name}</p>
          <img src={team?.logo} alt='team logo' className='h-16 w-16' />
        </div>
      </Card>
      <ActiveTrainings trainings={activeTrainings} />

      <ActiveTrainings trainings={completedTrainings} isArchived />
    </>
  );
};

export default TrainingPage;
