import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../../components/ui/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel';
import { Button } from '../../components/ui/button';
import AssignRefereeModal from '../../components/referee/AssignRefereeModal';
import Spinner from '../../components/Spinner';
import PageHeader from '../../components/PageHeader';
import { GetRefeeres } from '../../api/getReferees';
import { GetSeasonByLeagueId } from '../../api/getSeasonByLeagueId';

const AssignReferee = () => {
  const leagueId = useParams().id;
  const { toast } = useToast();
  const [rounds, setRounds] = useState([]);
  const [isSet, setIsSet] = useState(false);
  const { season, league, loading } = GetSeasonByLeagueId(leagueId);
  const referees = GetRefeeres();

  const handleGetRounds = async () => {
    try {
      const res = await fetch(
        `/api/referee/get-rounds/${leagueId}?seasonId=${season?._id}`
      );
      const fetchedRounds = await res.json();

      if (fetchedRounds.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Error!',
          description: 'No schedule found. Generate schedule first.',
        });
      } else if (fetchedRounds) {
        setRounds(fetchedRounds);

        toast({
          title: 'Schedule Downloaded!',
          description: 'Schedule has been downloaded successfully.',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSet) {
      handleGetRounds();
      setIsSet(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSet]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className=' text-gray-800 dark:text-white py-8 px-4 md:px-6 lg:px-8'>
      <PageHeader
        title='Assign Referee'
        description='Assign referees to matches here'
        sideText={`${league} / ${season?.name}`}
      />
      <div className='flex justify-between mb-6'>
        <Button
          type='button'
          onClick={handleGetRounds}
          className='bg-primary-500 text-white hover:bg-purple-600 px-4 py-2 rounded-md'
        >
          Download Schedule
        </Button>
      </div>
      {rounds?.length > 0 && (
        <Carousel>
          <div className='w-full flex flex-col items-center'>
            <h3 className='text-2xl font-bold mb-4 text-center'>Schedule:</h3>
            <div className='w-full max-w-4xl grid gap-8'>
              <CarouselContent>
                {rounds?.map((round) => (
                  <CarouselItem key={round._id}>
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 overflow-hidden'>
                      <div className='bg-primary-500 text-white px-6 py-4 flex items-center justify-between'>
                        <h3 className='text-xl font-semibold'>{round?.name}</h3>
                        <h3 className='text-xl font-semibold'>
                          {league} / {season?.name}
                        </h3>
                      </div>
                      <div className='p-6'>
                        {round?.matches?.map((match) => (
                          <div
                            key={match?.matchId}
                            className='flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:mb-0 last:pb-0 last:border-none'
                          >
                            <div className='flex-1 mr-4'>
                              <div className='text-gray-800 dark:text-white font-semibold'>
                                {match.homeTeam?.name} vs {match.awayTeam?.name}
                              </div>
                              <div className='text-gray-600 dark:text-gray-400 max-sm:hidden'>
                                {new Date(match?.startDate).toLocaleString(
                                  'en-US',
                                  {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                  }
                                )}
                              </div>
                            </div>
                            <div className='flex-shrink-0 ml-4'>
                              <AssignRefereeModal
                                match={match}
                                referees={referees}
                                isSet={setIsSet}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className='absolute left-0 transform -translate-y-1/2 top-1/2 bg-primary-500 text-white hover:bg-purple-500 px-4 py-2 rounded-l-md max-sm:hidden' />
              <CarouselNext className='absolute right-0 transform -translate-y-1/2 top-1/2 bg-primary-500 text-white hover:bg-purple-500 px-4 py-2 rounded-r-md max-sm:hidden' />
            </div>
          </div>
        </Carousel>
      )}
    </div>
  );
};

export default AssignReferee;
