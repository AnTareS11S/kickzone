import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';

import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '../../components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFetchPlayerById } from '../../components/hooks/useFetchPlayerById';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import { Separator } from '../../components/ui/separator';
import { useFetchTeamPlayers } from '../../components/hooks/useFetchTeamPlayers';
import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';
import BackButton from '../../components/BackButton';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../components/ui/use-toast';

const formSchema = z.object({
  attendance: z.boolean(),
});

const playerFormSchema = () => {
  return z.object({
    player: z.string().min(1, {
      message: 'Player is required',
    }),
  });
};

const columns = [
  {
    name: 'No.',
    selector: (row, index) => index + 1,
    grow: 0,
  },
  {
    name: 'Player',
    selector: (row) => row.name + ' ' + row.surname,
    sortable: true,
  },
];

const TrainingDetails = () => {
  const [training, setTraining] = useState([]);
  const [loading, setLoading] = useState(false);
  const { player } = useFetchPlayerById();
  const { coach } = useFetchCoachByUserId();
  const { playersToSelect: players } = useFetchTeamPlayers(coach?.currentTeam);
  const trainingId = useLocation().pathname.split('/').pop();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendance: false,
    },
  });

  useEffect(() => {
    const getTraining = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/training/get/${trainingId}`);
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch data!');
        }
        const data = await res.json();
        setTraining(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getTraining();
  }, [trainingId]);

  const participants = training?.participants?.includes(player?._id);

  useEffect(() => {
    form.setValue('attendance', training?.participants?.includes(player?._id));
  }, [participants, player?._id, form, training]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/admin/training/attendace/${trainingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          playerId: player?._id,
        }),
      });
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Attendance marked successfully',
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to mark attendance',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fields = [
    {
      id: 'player',
      label: 'Player',
      type: 'select',
      name: 'player',
      items: players,
      placeholder: 'Select a Player',
      idFlag: true,
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BackButton />
      <div className=' mt-8'>
        <Card className='p-2 shadow-md space-y-6 w-full bg-slate-400'>
          <CardHeader className='text-white py-2'>
            <div className='text-heading3-bold font-semibold text-center'>
              {training?.name}
            </div>
            <div className='text-gray-800 text-center mt-2'>
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
            </div>
          </CardHeader>
          {training?.isActive && player && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <div className='flex items-center justify-center'>
                  <FormField
                    control={form.control}
                    name='attendance'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-2 justify-center text-gray-900'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        Mark attendance and submit
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex items-center justify-center'>
                  <Button
                    type='submit'
                    className='bg-primary-500 hover:bg-purple-500'
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </Card>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
          {training?.trainingType && (
            <Card className='p-6 shadow-md space-y-6'>
              <CardHeader>
                <p className='text-heading4-medium font-semibold text-center'>
                  Training Type
                </p>
              </CardHeader>
              <CardContent>
                <p className='text-gray-800'>{training?.trainingType?.name}</p>
              </CardContent>
            </Card>
          )}
          {training?.trainingType?.description && (
            <Card className='p-6 shadow-md space-y-6'>
              <CardHeader>
                <p className='text-heading4-medium font-semibold text-center'>
                  Type Description
                </p>
              </CardHeader>
              <CardContent>
                <p className='text-gray-800'>
                  {training?.trainingType?.description}
                </p>
              </CardContent>
            </Card>
          )}
          {training?.notes && (
            <Card className='p-6 shadow-md space-y-6'>
              <CardHeader>
                <p className='text-heading4-medium font-semibold text-center'>
                  Coach Notes
                </p>
              </CardHeader>
              <CardContent>
                <p className='text-gray-800'>{training?.notes}</p>
              </CardContent>
            </Card>
          )}

          {training?.equipment && (
            <Card className='p-6 shadow-md space-y-6'>
              <CardHeader>
                <p className='text-heading4-medium font-semibold text-center'>
                  Required Equipment
                </p>
              </CardHeader>
              <CardContent>
                <p className='text-gray-800'>{training?.equipment}</p>
              </CardContent>
            </Card>
          )}
        </div>
        <Separator className='my-5' />
        {!player && training?.participants && (
          <>
            <div className='flex items-center justify-center'>
              <h3 className='text-heading3-bold font-medium'>Participants</h3>
            </div>
            <CrudPanel
              apiPath='participants'
              columns={columns}
              fields={fields}
              title='Participant'
              objectId={trainingId}
              onDeleteComponent={DeleteEntity}
              formSchema={playerFormSchema}
              defaultValues={{ player: '' }}
              isAction={true}
            />
          </>
        )}
      </div>
    </>
  );
};

export default TrainingDetails;
