import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';
import { useFetchPlayerByUserId } from '../../components/hooks/useFetchPlayerByUserId';
import { useFetchTeamById } from '../../components/hooks/useFetchTeamById';
import { useFetchTrainingsByCoachId } from '../../components/hooks/useFetchTrainingsByCoachId';
import Spinner from '../../components/Spinner';
import ActiveTrainings from '../../components/training/ActiveTrainings';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';

const TrainingPage = () => {
  const { player } = useFetchPlayerByUserId();
  const { coach, loading: coachLoading } = useFetchCoachByUserId();
  const { team, loading: teamLoading } = useFetchTeamById(
    player?.currentTeam || coach?.currentTeam
  );
  const { trainings, loading: trainingsLoading } = useFetchTrainingsByCoachId(
    coach?._id || team?.coach?._id
  );

  const activeTrainings = trainings?.filter((training) => training?.isActive);
  const completedTrainings = trainings?.filter(
    (training) => training?.isCompleted
  );

  if (coachLoading || teamLoading || trainingsLoading) {
    return <Spinner />;
  }

  if (!coach?.currentTeam && !player?.currentTeam) {
    return (
      <Card className='mx-auto max-w-md mt-8'>
        <CardContent className='p-6'>
          <p className='text-lg text-gray-800 text-center'>
            You are not assigned to any team yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='mb-8'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-2xl font-bold'>{team?.name}</CardTitle>
          <Avatar className='h-20 w-20'>
            <img
              src={
                team?.logoUrl ||
                'https://d3awt09vrts30h.cloudfront.net/team_img_default.png'
              }
              alt='Team logo'
              className='object-cover'
            />
          </Avatar>
        </CardHeader>
      </Card>

      <Tabs defaultValue='active' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='active'>Active Trainings</TabsTrigger>
          <TabsTrigger value='completed'>Completed Trainings</TabsTrigger>
        </TabsList>
        <TabsContent value='active'>
          <ActiveTrainings trainings={activeTrainings} />
        </TabsContent>
        <TabsContent value='completed'>
          <ActiveTrainings trainings={completedTrainings} isArchived />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingPage;
