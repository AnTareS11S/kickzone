import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FormArea from '../../components/FormArea';
import { Form } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel';
import { Card } from '../../components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFetchSeasons } from '../../components/hooks/useFetchSeasons';
import { Separator } from '../../components/ui/separator';
import { useToast } from '../../components/ui/use-toast';
import ScheduleModal from '../../components/referee/ScheduleModal';
import { useFetchTeamsByLeagueId } from '../../components/hooks/useFetchTeamsByLeagueId';
import BackButton from '../../components/BackButton';

const schema = z.object({
  startDate: z.coerce.date().refine({
    message: 'Date is required',
  }),
  season: z.string().min(1, { message: 'Season is required' }),
});

const ScheduleManagement = () => {
  const leagueId = useLocation().pathname.split('/')[5];
  const [rounds, setRounds] = useState([]);
  const [showGeneratedSchedule, setShowGeneratedSchedule] = useState(false);
  const seasons = useFetchSeasons();
  const { toast } = useToast();
  const { selectTeams, loading } = useFetchTeamsByLeagueId(leagueId);

  useEffect(() => {
    if (!showGeneratedSchedule) {
      setRounds([]);
    }
  }, [showGeneratedSchedule]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: '',
      season: '',
    },
    mode: 'onChange',
  });

  const { getValues } = form;

  const fetchFromApi = async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return response.json();
      } else {
        console.error(`Failed to ${method} data`);
      }

      if (response.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Error!',
          description: 'Schedule is already generated. Delete rounds first',
        });
      }
    } catch (error) {
      console.error(`Error while ${method} data:`, error);
    }
  };

  const handleGenerateSchedule = async () => {
    const { startDate, season } = getValues();

    const newSchedule = await fetchFromApi(
      `/api/referee/generate-schedule/${leagueId}`,
      'POST',
      { startDate, seasonId: season }
    );

    if (newSchedule) {
      setShowGeneratedSchedule(true);
      handleGetRounds();

      toast({
        title: 'Schedule Generated!',
        description: 'Schedule has been generated successfully.',
      });
    }
  };

  const handleDeleteRounds = async () => {
    await fetchFromApi(`/api/referee/delete-rounds/${leagueId}`, 'DELETE');
    toast({
      title: 'Rounds Deleted!',
      description: 'All rounds have been deleted successfully.',
    });
  };

  const handleGetRounds = async () => {
    const fetchedRounds = await fetchFromApi(
      `/api/referee/get-rounds/${leagueId}`
    );

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
  };

  return (
    <div className='container mx-auto space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Schedule</div>
        <p className='text-sm text-muted-foreground'>
          To edit schedule download it first.
        </p>
      </div>

      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleGenerateSchedule)}
          className='flex flex-col gap-6 w-full'
        >
          <FormArea
            id='startDate'
            label='Date of first match'
            type='date'
            form={form}
            name='startDate'
            placeholder='Select date'
            initialDate={new Date()}
          />
          <FormArea
            id='season'
            label='Season'
            type='select'
            form={form}
            name='season'
            items={seasons}
            placeholder='Select a Season'
            idFlag={true}
          />
          <div className='flex flex-col gap-5 w-full min-sm:w-[350px]'>
            <Button
              type='submit'
              className='bg-primary-500 text-white hover:bg-purple-500'
            >
              Generate Schedule
            </Button>
            <Button
              onClick={handleGetRounds}
              type='button'
              className='bg-primary-500 text-white hover:bg-purple-500 '
            >
              Download Schedule
            </Button>
            <Button
              type='button'
              onClick={() => {
                handleDeleteRounds();
                setShowGeneratedSchedule(false);
              }}
              className='bg-red-500 text-white hover:bg-red-700 '
            >
              Delete Rounds
            </Button>
          </div>
        </form>
      </Form>

      {rounds?.length > 0 && (
        <div className='flex flex-col items-center w-full'>
          <h3 className='text-heading2-semibold font-bold mb-4'>Schedule:</h3>
          <ul>
            <Carousel>
              <CarouselContent>
                <div className='grid grid-cols-1  gap-4'>
                  {rounds?.map((round) => (
                    <CarouselItem key={round._id}>
                      <Card>
                        <h3 className='text-heading3-bold border-t p-4'>
                          {round?.name}
                        </h3>
                        <div className='flex flex-wrap'>
                          {round?.matches.map((match) => (
                            <div
                              key={match.matchId}
                              className='grid grid-cols-3 w-full border-t p-5 max-sm:grid-cols-1'
                            >
                              <span className='text-gray-700'>
                                {match.homeTeam.split(':')[0]} vs{' '}
                                {match.awayTeam.split(':')[0]}
                              </span>
                              <span className='text-gray-700'>
                                {new Date(match?.startDate).toLocaleDateString(
                                  'en-EN',
                                  {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                  }
                                )}
                              </span>
                              <ScheduleModal
                                match={match}
                                teams={selectTeams}
                                loading={loading}
                              />
                            </div>
                          ))}
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </div>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
