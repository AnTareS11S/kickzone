import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from './ui/form';
import { playerStatsFormSchema } from '../lib/validation/ResultValidation';
import FormArea from './FormArea';
import { useToast } from './ui/use-toast';
import { useLocation } from 'react-router-dom';
import { useFetchSeasonByMatchId } from './hooks/useFetchSeasonByMatchId';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';

const ExpandedStatsComponent = ({ data }) => {
  const matchId = useLocation().pathname.split('/')[5];
  const seasonId = useFetchSeasonByMatchId(matchId);
  const { toast } = useToast();
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(playerStatsFormSchema()),
    defaultValues: {
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      ownGoals: 0,
      cleanSheets: 0,
      minutesPlayed: 90,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/referee/match-stats/${matchId}/${data?._id}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setIsReset(true);
            form.reset(data);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [data, form, matchId]);

  const onSubmit = async (formData) => {
    try {
      const res = await fetch('/api/referee/add-match-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          player: data?._id,
          season: seasonId,
          matchId,
        }),
      });

      if (res.ok) {
        setIsReset(true);
        toast({
          title: 'Success!',
          description: 'Player stats added successfully',
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to add player stats',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetStats = async () => {
    try {
      const res = await fetch(
        `/api/referee/delete-stats/${matchId}/${data?._id}`,
        {
          method: 'DELETE',
        }
      );

      if (res.ok) {
        setIsReset(false);
        form.reset();
        toast({
          title: 'Success!',
          description: 'Player stats removed successfully',
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to remove player stats',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-row w-full max-md:flex-col min-lg:flex-col gap-4 p-5'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-6 w-full items-center max-md:grid-cols-4 max-sm:grid-cols-1 xl:grid-cols-7 gap-4 mb-4 max-[936px]:grid-cols-4'>
              <FormArea
                id='minutesPlayed'
                label='Minutes Played'
                type='number'
                form={form}
                name='minutesPlayed'
                styles='w-28 text-center max-sm:w-[270px]'
              />
              <FormArea
                id='goals'
                label='Goals'
                type='number'
                form={form}
                name='goals'
                styles='w-28 text-center max-sm:w-[270px]'
              />
              <FormArea
                id='assists'
                label='Assists'
                type='number'
                form={form}
                name='assists'
                styles='w-28 text-center max-sm:w-[270px]'
              />
              <FormArea
                id='yellowCards'
                label='Yellow Cards'
                type='number'
                form={form}
                name='yellowCards'
                styles='w-28 text-center max-sm:w-[270px]'
              />
              <FormArea
                id='redCards'
                label='Red Cards'
                type='number'
                form={form}
                name='redCards'
                styles='w-28 text-center max-sm:w-[270px]'
              />

              <FormArea
                id='ownGoals'
                label='Own Goals'
                type='number'
                form={form}
                name='ownGoals'
                styles='w-28 text-center max-sm:w-[270px]'
              />
              {data?.position === 'Goalkeeper' && (
                <>
                  <FormArea
                    id='cleanSheets'
                    label='Cleen Sheets'
                    type='number'
                    form={form}
                    name='cleanSheets'
                    styles='w-28 text-center max-sm:w-[270px]'
                  />
                </>
              )}
            </div>
            <Button
              type='submit'
              className='w-28 bg-primary-500 text-white hover:bg-purple-500 max-sm:w-[270px]'
              disabled={form.getValues('minutesPlayed') === '0'}
            >
              Save
            </Button>
            <Button
              type='button'
              variant='destructive'
              className='w-28 max-sm:w-[270px] ml-4'
              disabled={!isReset}
              onClick={handleResetStats}
            >
              Reset Stats
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ExpandedStatsComponent;
