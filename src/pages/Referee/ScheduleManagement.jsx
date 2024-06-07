import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormArea from '../../components/FormArea';
import { Form } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFetchSeasons } from '../../components/hooks/useFetchSeasons';
import { Separator } from '../../components/ui/separator';
import { useToast } from '../../components/ui/use-toast';
import ScheduleModal from '../../components/referee/ScheduleModal';
import { useFetchTeamsByLeagueId } from '../../components/hooks/useFetchTeamsByLeagueId';
import BackButton from '../../components/BackButton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel';

const schema = () =>
  z.object({
    startDate: z.coerce.date().refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        return date.getTime() > today.getTime();
      },
      {
        message: 'Date must be in the future ',
      }
    ),
    season: z.string().min(1, { message: 'Season is required' }),
  });

const scheduleSchema = () =>
  z.object({
    selectedSeason: z
      .string()
      .min(1, { message: 'Season selection is required' }),
  });

const ScheduleManagement = () => {
  const leagueId = useParams().id;
  const [rounds, setRounds] = useState([]);
  const [showGeneratedSchedule, setShowGeneratedSchedule] = useState(false);
  const seasons = useFetchSeasons();
  const { toast } = useToast();
  const { selectTeams } = useFetchTeamsByLeagueId(leagueId);

  useEffect(() => {
    if (!showGeneratedSchedule) {
      setRounds([]);
    }
  }, [showGeneratedSchedule]);

  const form = useForm({
    resolver: zodResolver(schema()),
    defaultValues: {
      startDate: '',
      season: '',
    },
    mode: 'onChange',
  });

  const scheduleForm = useForm({
    resolver: zodResolver(scheduleSchema()),
    defaultValues: {
      selectedSeason: '',
    },
    mode: 'onChange',
  });

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

      if (response.status === 405) {
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
    const { startDate, season } = form.getValues();

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
    const { selectedSeason } = scheduleForm.getValues();

    if (!selectedSeason) {
      scheduleForm.setError('selectedSeason', {
        type: 'manual',
        message: 'Season selection is required',
      });
      return;
    }
    await fetchFromApi(
      `/api/referee/delete-schedule/${leagueId}?seasonId=${selectedSeason}`,
      'DELETE'
    );
    toast({
      title: 'Rounds Deleted!',
      description: 'All rounds have been deleted successfully.',
    });
  };

  const handleGetRounds = async () => {
    const { selectedSeason } = scheduleForm.getValues();

    const fetchedRounds = await fetchFromApi(
      `/api/referee/get-rounds/${leagueId}?seasonId=${selectedSeason}`
    );

    if (fetchedRounds?.length === 0) {
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
    <div className='container mx-auto py-8 px-4 md:px-6 lg:px-8'>
      <BackButton />

      <div className='mb-6'>
        <h1 className='text-body1-bold font-bold mb-2'>Schedule Management</h1>
        <p className='text-gray-600'>To edit schedule, download it first.</p>
      </div>

      <Separator />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleGenerateSchedule)}
            className='flex flex-col gap-4'
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
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Button
                type='submit'
                className='bg-primary-500 text-white hover:bg-purple-500 flex-1'
              >
                Generate Schedule
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <Form {...scheduleForm}>
          <form
            className='flex flex-col gap-4'
            onSubmit={scheduleForm.handleSubmit(handleGetRounds)}
          >
            <FormArea
              id='selectedSeason'
              label='Season'
              type='select'
              form={scheduleForm}
              name='selectedSeason'
              items={seasons}
              placeholder='Select a Season'
              idFlag={true}
            />
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Button
                type='submit'
                className='bg-primary-500 text-white hover:bg-purple-500 flex-1'
              >
                Download Schedule
              </Button>
              <Button
                type='button'
                onClick={() => {
                  handleDeleteRounds();
                  setShowGeneratedSchedule(false);
                }}
                className='bg-red-500 text-white hover:bg-red-700 flex-1'
              >
                Delete Rounds
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {rounds?.length > 0 && (
        <Carousel>
          <div className='w-full flex flex-col items-center'>
            <h3 className='text-2xl font-bold mb-4 text-center'>Schedule:</h3>
            <div className='w-full max-w-4xl grid gap-8'>
              <CarouselContent>
                {rounds?.map((round) => (
                  <CarouselItem key={round._id}>
                    <div className='bg-white rounded-lg shadow-lg border-slate-300 border overflow-hidden'>
                      <div className='bg-gray-800 text-white px-6 py-4 flex items-center justify-between'>
                        <h3 className='text-xl font-semibold'>{round?.name}</h3>
                      </div>
                      <div className='p-6'>
                        {round?.matches.map((match) => (
                          <div
                            key={match.matchId}
                            className='flex justify-between items-center mb-4 pb-4 border-b last:mb-0 last:pb-0 last:border-none'
                          >
                            <div className='flex-1 mr-4'>
                              <div className='text-gray-800 font-semibold'>
                                {match.homeTeam.split(':')[0]} vs{' '}
                                {match.awayTeam.split(':')[0]}
                              </div>
                              <div className='text-gray-600 max-sm:hidden'>
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
                              <ScheduleModal
                                match={match}
                                teams={selectTeams}
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

export default ScheduleManagement;
