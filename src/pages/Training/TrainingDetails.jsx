import { useEffect, useState, useCallback } from 'react';
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
import { Button } from '../../components/ui/button';
import { Form } from '../../components/ui/form';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import { Separator } from '../../components/ui/separator';
import BackButton from '../../components/BackButton';
import { useToast } from '../../components/ui/use-toast';
import {
  FaCalendar,
  FaClipboardList,
  FaClock,
  FaInfo,
  FaMapPin,
  FaUsers,
} from 'react-icons/fa';
import FormArea from '../../components/FormArea';
import { GetCoachByUserId } from '../../api/getCoachByUserId';
import { GetPlayerByUserId } from '../../api/getPlayerByUserId';
import { GetTeamPlayers } from '../../api/getTeamPlayers';

const formSchema = z.object({
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
  const { player, currentUser } = GetPlayerByUserId();
  const { coach } = GetCoachByUserId();
  const { playersToSelect: players } = GetTeamPlayers(coach?.currentTeam);
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
    <div className='mx-auto px-4 py-8 max-w-8xl'>
      <div className='flex items-center justify-between mb-8'>
        <BackButton />
        <div className='text-sm text-gray-500 flex items-center gap-2'>
          <FaClock className='w-4 h-4' />
          {new Date(training?.trainingDate).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <div className='grid md:grid-cols-3 gap-6'>
        <div className='md:col-span-2'>
          <Card className='bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-xl shadow-2xl'>
            <CardHeader className='pb-0'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-3xl font-bold flex items-center gap-3'>
                  <FaCalendar className='w-8 h-8' />
                  {training?.name}
                </CardTitle>
                {training?.isActive && (
                  <span className='bg-green-500 text-white px-3 py-1 rounded-full text-xs'>
                    Active
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className='pt-4'>
              <div className='grid md:grid-cols-3 gap-4 text-white/90'>
                <div className='flex items-center gap-2'>
                  <FaClock className='w-5 h-5' />
                  <span>{training?.duration} mins</span>
                </div>
                <div className='flex items-center gap-2'>
                  <FaMapPin className='w-5 h-5' />
                  <span>{training?.location}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <FaInfo className='w-5 h-5' />
                  <span>{training?.trainingType?.name}</span>
                </div>
              </div>

              {training?.isActive && currentUser?.role === 'player' && (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='mt-6 bg-white/10 p-4 rounded-lg'
                  >
                    <div className='flex flex-col items-center justify-center w-full space-y-2 '>
                      <div className='flex items-center gap-2'>
                        <FormArea
                          id='attendance'
                          type='checkbox'
                          form={form}
                          name='attendance'
                          labelName='Mark Attendance'
                        />
                      </div>

                      <Button
                        type='submit'
                        className='bg-white text-primary-500 hover:bg-purple-100'
                      >
                        Submit Attendance
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          {['typeDescription', 'notes', 'equipment'].map(
            (item) =>
              training?.[item] && (
                <Card
                  key={item}
                  className='bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-shadow'
                >
                  <CardHeader className='pb-2'>
                    <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                      {item === 'typeDescription' ? (
                        <FaClipboardList className='w-5 h-5' />
                      ) : item === 'notes' ? (
                        <FaInfo className='w-5 h-5' />
                      ) : (
                        <FaUsers className='w-5 h-5' />
                      )}
                      {item === 'typeDescription'
                        ? 'Type Description'
                        : item === 'notes'
                        ? 'Coach Notes'
                        : 'Required Equipment'}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-600'>{training[item]}</p>
                  </CardContent>
                </Card>
              )
          )}
        </div>
      </div>

      {coach && currentUser?.role === 'coach' && training?.participants && (
        <div className='mt-18'>
          <Separator className='mb-6' />
          <h3 className='text-2xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center gap-3'>
            <FaUsers className='w-7 h-7' />
            Training Participants
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
        </div>
      )}
    </div>
  );
};

export default TrainingDetails;
