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
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import { Separator } from '../../components/ui/separator';
import { useFetchTeamPlayers } from '../../components/hooks/useFetchTeamPlayers';
import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';
import BackButton from '../../components/BackButton';
import { useParams } from 'react-router-dom';
import { useToast } from '../../components/ui/use-toast';
import { useFetchPlayerByUserId } from '../../components/hooks/useFetchPlayerByUserId';

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
  const { player, currentUser } = useFetchPlayerByUserId();
  const { coach } = useFetchCoachByUserId();
  const { playersToSelect: players } = useFetchTeamPlayers(coach?.currentTeam);
  const trainingId = useParams().id;
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
    return <Spinner />;
  }

  return (
    <>
      <BackButton />
      <div className='mt-8'>
        <Card className='p-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-md'>
          <CardHeader className='text-center'>
            <h2 className='text-2xl md:text-3xl font-bold'>{training?.name}</h2>
            <div className='text-gray-200 mt-2'>
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
          {training?.isActive && currentUser?.role === 'player' && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='mt-6'>
                <div className='flex items-center justify-center'>
                  <FormField
                    control={form.control}
                    name='attendance'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-2 justify-center text-gray-200'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className='text-white'
                          />
                        </FormControl>
                        Mark attendance and submit
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex items-center justify-center mt-4'>
                  <Button
                    type='submit'
                    className='bg-white text-purple-500 hover:bg-purple-100 px-6 py-2 rounded-lg shadow-md'
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </Card>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
          {training?.trainingType && (
            <Card className='p-6 bg-gray-100 rounded-lg shadow-md'>
              <CardHeader>
                <h3 className='text-lg font-semibold text-center'>
                  Training Type
                </h3>
              </CardHeader>
              <CardContent>
                <p className='text-gray-800 text-center'>
                  {training?.trainingType?.name}
                </p>
              </CardContent>
            </Card>
          )}
          {training?.trainingType?.description && (
            <Card className='p-6 bg-gray-100 rounded-lg shadow-md'>
              <CardHeader>
                <h3 className='text-lg font-semibold text-center'>
                  Type Description
                </h3>
              </CardHeader>
              <CardContent>
                <p className='text-gray-800 text-center'>
                  {training?.trainingType?.description}
                </p>
              </CardContent>
            </Card>
          )}
          {training?.notes && (
            <Card className='p-6 bg-gray-100 rounded-lg shadow-md'>
              <CardHeader>
                <h3 className='text-lg font-semibold text-center'>
                  Coach Notes
                </h3>
              </CardHeader>
              <CardContent>
                <p className='text-gray-800 text-center'>{training?.notes}</p>
              </CardContent>
            </Card>
          )}

          {training?.equipment && (
            <Card className='p-6 bg-gray-100 rounded-lg shadow-md'>
              <CardHeader>
                <h3 className='text-lg font-semibold text-center'>
                  Required Equipment
                </h3>
              </CardHeader>
              <CardContent>
                <p className='text-gray-800 text-center'>
                  {training?.equipment}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        <Separator className='my-5' />
        {coach && currentUser?.role === 'coach' && training?.participants && (
          <>
            <div className='flex items-center justify-center mb-4'>
              <h3 className='text-2xl font-bold text-gray-800'>Participants</h3>
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
