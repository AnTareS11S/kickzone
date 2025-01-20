import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from './ui/form';
import { playerStatsFormSchema } from '../lib/validation/ResultValidation';
import FormArea from './FormArea';
import { useToast } from './ui/use-toast';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { GetSeasonByMatchId } from '../api/getSeasonByMatchId';

const ExpandedStatsComponent = ({ data }) => {
  const matchId = useParams().id;
  const seasonId = GetSeasonByMatchId(matchId);
  const { toast } = useToast();
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(true);

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
        const res = await fetch(
          `/api/referee/match-stats/${matchId}/${data?._id}`
        );
        if (res.ok) {
          const playerData = await res.json();
          setIsReset(true);
          form.reset(playerData);
          setLoading(false);
        } else if (res.status === 404) {
          setIsReset(false);
          form.reset();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, matchId]);

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
        const errorData = await res.json();
        toast({
          title: 'Error!',
          description: errorData.message || 'Failed to add player stats',
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
        form.reset(
          {
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            ownGoals: 0,
            cleanSheets: 0,
            minutesPlayed: 90,
          },
          { keepValues: false }
        );
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
    return <Spinner />;
  }

  return (
    <div className='bg-gray-100 py-8'>
      <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold mb-4'>Player Stats</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4'>
              <FormArea
                id='minutesPlayed'
                label='Minutes Played'
                type='number'
                form={form}
                name='minutesPlayed'
                styles='w-full'
              />
              <FormArea
                id='goals'
                label='Goals'
                type='number'
                form={form}
                name='goals'
                styles='w-full'
              />
              <FormArea
                id='assists'
                label='Assists'
                type='number'
                form={form}
                name='assists'
                styles='w-full'
              />
              <FormArea
                id='yellowCards'
                label='Yellow Cards'
                type='number'
                form={form}
                name='yellowCards'
                styles='w-full'
              />
              <FormArea
                id='redCards'
                label='Red Cards'
                type='number'
                form={form}
                name='redCards'
                styles='w-full'
              />
              <FormArea
                id='ownGoals'
                label='Own Goals'
                type='number'
                form={form}
                name='ownGoals'
                styles='w-full'
              />
              {data?.position === 'Goalkeeper' && (
                <FormArea
                  id='cleanSheets'
                  label='Clean Sheets'
                  type='number'
                  form={form}
                  name='cleanSheets'
                  styles='w-full'
                />
              )}
            </div>
            <div className='flex justify-end'>
              <Button
                type='submit'
                className='bg-primary-500 text-white hover:bg-purple-500 px-4 py-2 rounded-md'
                disabled={form.getValues('minutesPlayed') === '0'}
              >
                Save
              </Button>
              <Button
                type='button'
                variant='destructive'
                className='bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md ml-4'
                disabled={!isReset}
                onClick={handleResetStats}
              >
                Reset Stats
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ExpandedStatsComponent;
