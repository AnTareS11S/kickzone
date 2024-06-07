import { useState } from 'react';
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
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import AssignRefereeModal from '../../components/referee/AssignRefereeModal';
import { useFetchRefeeres } from '../../components/hooks/useFetchReferees';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormArea from '../../components/FormArea';
import { Form } from '../../components/ui/form';
import { useFetchSeasons } from '../../components/hooks/useFetchSeasons';

const scheduleSchema = () =>
  z.object({
    selectedSeason: z
      .string()
      .min(1, { message: 'Season selection is required' }),
  });

const AssignReferee = () => {
  const leagueId = useParams().id;
  const { toast } = useToast();
  const [rounds, setRounds] = useState([]);
  const seasons = useFetchSeasons();
  const referees = useFetchRefeeres();

  const scheduleForm = useForm({
    resolver: zodResolver(scheduleSchema()),
    defaultValues: {
      selectedSeason: '',
    },
    mode: 'onChange',
  });

  const handleGetRounds = async () => {
    const { selectedSeason } = scheduleForm.getValues();
    const res = await fetch(
      `/api/referee/get-rounds/${leagueId}?seasonId=${selectedSeason}`
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
  };

  return (
    <div className='container mx-auto py-8 px-4 md:px-6 lg:px-8'>
      <BackButton />

      <div className='mb-6'>
        <h1 className='text-body1-bold font-bold mb-2'>Assign Referee</h1>
        <p className='text-gray-600'>Assign referees to matches here.</p>
      </div>

      <Separator />

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
                        {round?.matches?.map((match) => (
                          <div
                            key={match?.matchId}
                            className='flex justify-between items-center mb-4 pb-4 border-b last:mb-0 last:pb-0 last:border-none'
                          >
                            <div className='flex-1 mr-4'>
                              <div className='text-gray-800 font-semibold'>
                                {match.homeTeam?.split(':')[0]} vs{' '}
                                {match.awayTeam?.split(':')[0]}
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
                              <AssignRefereeModal
                                match={match}
                                referees={referees}
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
