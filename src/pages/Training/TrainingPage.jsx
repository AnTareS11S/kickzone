import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';
import { useFetchPlayerByUserId } from '../../components/hooks/useFetchPlayerByUserId';
import { useFetchTeamById } from '../../components/hooks/useFetchTeamById';
import { useFetchTrainingsByCoachId } from '../../components/hooks/useFetchTrainingsByCoachId';
import Spinner from '../../components/Spinner';
import ActiveTrainings from '../../components/training/ActiveTrainings';
import { Card } from '../../components/ui/card';

const TrainingPage = () => {
  const { player } = useFetchPlayerByUserId();
  const { coach, loading } = useFetchCoachByUserId();
  const { team, loading: teamLoading } = useFetchTeamById(
    player?.currentTeam || coach?.currentTeam
  );
  const { trainings } = useFetchTrainingsByCoachId(
    coach?._id || team?.coach?._id
  );

  const activeTrainings = trainings?.filter((training) => training?.isActive);

  const completedTrainings = trainings?.filter(
    (training) => training?.isCompleted
  );

  if (loading || teamLoading) {
    return <Spinner />;
  }

  return (
    <>
      {coach?.currentTeam || player?.currentTeam ? (
        <>
          <Card className='p-6  shadow-md space-y-6'>
            <div className='flex items-center justify-between space-x-4'>
              <p className='text-heading4-medium font-semibold'>{team?.name}</p>
              <img
                src={
                  team?.logoUrl ||
                  'https://d3awt09vrts30h.cloudfront.net/team_img_default.png'
                }
                alt='team logo'
                className='h-16 w-16'
              />
            </div>
          </Card>
          <ActiveTrainings trainings={activeTrainings} />

          <ActiveTrainings trainings={completedTrainings} isArchived />
        </>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <p className='text-lg text-gray-800 text-center'>
            You are not assigned to any team yet.
          </p>
        </div>
      )}
    </>
  );
};

export default TrainingPage;
