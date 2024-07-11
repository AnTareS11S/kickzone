import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Spinner from '../../components/Spinner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '../../components/ui/form';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import { Separator } from '../../components/ui/separator';
import BackButton from '../../components/BackButton';
import { useToast } from '../../components/ui/use-toast';

import { useFetchTeamPlayers } from '../../components/hooks/useFetchTeamPlayers';
import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';
import { useFetchPlayerByUserId } from '../../components/hooks/useFetchPlayerByUserId';

const formSchema = () =>
  z.object({
    attendance: z.boolean(),
  });

const playerFormSchema = () =>
  z.object({
    player: z.string().min(1, { message: 'Player is required' }),
  });

const columns = [
  { name: 'No.', selector: (row, index) => index + 1, grow: 0 },
  {
    name: 'Player',
    selector: (row) => `${row.name} ${row.surname}`,
    sortable: true,
  },
];

const TrainingDetails = () => {
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const { player, currentUser } = useFetchPlayerByUserId();
  const { coach } = useFetchCoachByUserId();
  const { playersToSelect: players } = useFetchTeamPlayers(coach?.currentTeam);
  const { id: trainingId } = useParams();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { attendance: false },
  });

  const fetchTraining = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/training/get/${trainingId}`);
      if (!res.ok) throw new Error('Failed to fetch data!');
      const data = await res.json();
      setTraining(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to fetch training details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [trainingId, toast]);

  useEffect(() => {
    fetchTraining();
  }, [fetchTraining]);

  useEffect(() => {
    if (training && player) {
      form.setValue('attendance', training.participants?.includes(player._id));
    }
  }, [training, player, form]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/admin/training/attendance/${trainingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, playerId: player?._id }),
      });
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Attendance marked successfully',
        });
      } else {
        throw new Error('Failed to mark attendance');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error!',
        description: 'Failed to mark attendance',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className='container mx-auto px-4 py-8'>
      <BackButton />
      <Card className='mt-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-lg'>
        <CardHeader className='text-center'>
          <CardTitle className='text-3xl font-bold'>{training?.name}</CardTitle>
          <p className='text-gray-200 mt-2'>
            {new Date(training?.trainingDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
            <br />
            Duration: {training?.duration} minutes
            <br />
            Location: {training?.location}
          </p>
        </CardHeader>
        {training?.isActive && currentUser?.role === 'player' && (
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='mt-6'>
                <FormField
                  control={form.control}
                  name='attendance'
                  render={({ field }) => (
                    <FormItem className='flex items-center justify-center gap-2 text-gray-200'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className='text-white'
                        />
                      </FormControl>
                      <label>Mark attendance and submit</label>
                    </FormItem>
                  )}
                />
                <div className='flex justify-center mt-4'>
                  <Button
                    type='submit'
                    className='bg-white text-purple-500 hover:bg-purple-100'
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        )}
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
        {['trainingType', 'typeDescription', 'notes', 'equipment'].map(
          (item) =>
            training?.[item] && (
              <Card key={item} className='bg-gray-100 rounded-lg shadow-md'>
                <CardHeader>
                  <h3 className='text-lg font-semibold text-center'>
                    {item === 'trainingType'
                      ? 'Training Type'
                      : item === 'typeDescription'
                      ? 'Type Description'
                      : item === 'notes'
                      ? 'Coach Notes'
                      : 'Required Equipment'}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-800 text-center'>
                    {item === 'trainingType'
                      ? training.trainingType.name
                      : training[item]}
                  </p>
                </CardContent>
              </Card>
            )
        )}
      </div>

      <Separator className='my-8' />

      {coach && currentUser?.role === 'coach' && training?.participants && (
        <>
          <h3 className='text-2xl font-bold text-gray-800 text-center mb-6'>
            Participants
          </h3>
          <CrudPanel
            apiPath='participants'
            columns={columns}
            fields={[
              {
                id: 'player',
                label: 'Player',
                type: 'select',
                name: 'player',
                items: players,
                placeholder: 'Select a Player',
                idFlag: true,
              },
            ]}
            title='Participant'
            objectId={trainingId}
            onDeleteComponent={DeleteEntity}
            formSchema={playerFormSchema}
            defaultValues={{ player: '' }}
            isExpandable={false}
            isAction={true}
          />
        </>
      )}
    </div>
  );
};

export default TrainingDetails;
