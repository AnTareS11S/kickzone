import { FaTrophy } from 'react-icons/fa';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { RiTeamFill } from 'react-icons/ri';
import { BiSolidZap } from 'react-icons/bi';
import { useEffect, useState } from 'react';

const TrainingPage = () => {
  const {
    player,
    currentUser,
    loading: playerLoading,
  } = useFetchPlayerByUserId();
  const { coach, loading: coachLoading } = useFetchCoachByUserId();
  const { team } = useFetchTeamById(player?.currentTeam || coach?.currentTeam);
  const { trainings, loading: trainingLoading } = useFetchTrainingsByCoachId(
    coach?._id || team?.coach?._id
  );
  const [processedTrainings, setProcessedTrainings] = useState({
    activeTrainings: [],
    completedTrainings: [],
  });
  const isLoading = playerLoading || coachLoading || !team || trainingLoading;

  useEffect(() => {
    if (trainings && currentUser?.role === 'player' && player?._id) {
      const processTrainings = (trainingsList) => {
        return trainingsList.map((training) => ({
          ...training,
          isNew: !training.isRead?.includes(player._id),
        }));
      };

      setProcessedTrainings({
        activeTrainings: processTrainings(
          trainings.filter((training) => training?.isActive)
        ),
        completedTrainings: processTrainings(
          trainings.filter((training) => training?.isCompleted)
        ),
      });
    } else if (trainings) {
      // If not a player, use original trainings
      setProcessedTrainings({
        activeTrainings: trainings.filter((training) => training?.isActive),
        completedTrainings: trainings.filter(
          (training) => training?.isCompleted
        ),
      });
    }
  }, [trainings, player?._id, currentUser?.role]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!coach?.currentTeam && !player?.currentTeam) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <Card className='w-full max-w-md shadow-xl hover:shadow-2xl transition-all duration-300'>
          <CardContent className='p-8 text-center'>
            <RiTeamFill
              className='mx-auto mb-4 text-primary-500'
              size={64}
              strokeWidth={1.5}
            />
            <p className='text-lg text-gray-800 text-center'>
              You are not assigned to any team yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-8xl mx-auto space-y-8'>
        <Card className='w-full shadow-lg hover:shadow-xl transition-all duration-300'>
          <CardHeader className='flex flex-col md:flex-row items-center justify-between p-6'>
            <div className='flex items-center space-x-4 mb-4 md:mb-0'>
              <div className='bg-blue-100 p-3 rounded-full'>
                <RiTeamFill className='text-primary-500' size={32} />
              </div>
              <CardTitle className='text-2xl md:text-3xl font-bold text-gray-800'>
                {team?.name}
              </CardTitle>
            </div>
            <div className='w-32 h-32 rounded-xl overflow-hidden shadow-md'>
              <img
                src={
                  team?.logoUrl ||
                  'https://d3awt09vrts30h.cloudfront.net/team_img_default.png'
                }
                alt='Team logo'
                className='w-full h-full object-cover transition-transform duration-300 hover:scale-110'
              />
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue='active' className='w-full'>
          <TabsList className='grid grid-cols-2 bg-white shadow-md rounded-full p-1 mb-6'>
            <TabsTrigger
              value='active'
              className='flex items-center space-x-2 rounded-full data-[state=active]:bg-primary-500 data-[state=active]:text-white'
            >
              <BiSolidZap size={20} />
              <span>Active Trainings</span>
            </TabsTrigger>
            <TabsTrigger
              value='completed'
              className='flex items-center space-x-2 rounded-full data-[state=active]:bg-primary-500 data-[state=active]:text-white'
            >
              <FaTrophy size={20} />
              <span>Completed Trainings</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='active' className='animate-fade-in'>
            <ActiveTrainings
              trainings={processedTrainings.activeTrainings}
              currentUser={currentUser}
            />
          </TabsContent>
          <TabsContent value='completed' className='animate-fade-in'>
            <ActiveTrainings
              trainings={processedTrainings.completedTrainings}
              isArchived
              currentUser={currentUser}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainingPage;
