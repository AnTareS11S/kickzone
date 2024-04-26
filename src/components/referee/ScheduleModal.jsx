import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormArea from '../FormArea';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

import { useForm } from 'react-hook-form';
import { Form } from '../ui/form';
import Spinner from '../Spinner';

const schema = z.object({
  homeTeam: z.string().min(1, { message: 'Home team is required' }),
  awayTeam: z.string().min(1, { message: 'Away team is required' }),
  startDate: z.coerce.date().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      return date.getTime() <= today.getTime();
    },
    {
      message: 'Date must be in the future or today',
    }
  ),
});

const ScheduleModal = ({ match, teams, loading }) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      homeTeam: match?.homeTeam,
      awayTeam: match?.awayTeam,
      startDate: match?.startDate,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    const updatedData = {
      ...data,
      homeTeam: data?.homeTeam?.split(':')[1]
        ? data?.homeTeam?.split(':')[1]
        : data?.homeTeam,
      awayTeam: data?.awayTeam?.split(':')[1]
        ? data?.awayTeam?.split(':')[1]
        : data?.awayTeam,
      startDate: new Date(data?.startDate).toISOString(),
    };

    try {
      const res = await fetch(`/api/referee/edit-match/${match?.matchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error('Error updating match');
      }
    } catch (error) {
      console.error(error);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary' className='w-32'>
          Edit Match
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[925px] h-[300px]'>
        <DialogHeader>
          <DialogTitle>Edit Match</DialogTitle>
          <DialogDescription>
            Make changes to this match here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-4 py-4'>
              <div className='grid grid-cols-4 space-x-8 items-center justify-center'>
                <div>
                  <FormArea
                    id='homeTeam'
                    label='Home Team'
                    type='select'
                    form={form}
                    name='homeTeam'
                    placeholder='Select Home Team'
                    defaultValue={match?.homeTeam.split(':')[0]}
                    items={teams}
                    idFlag={true}
                  />
                </div>
                <div>
                  <FormArea
                    id='awayTeam'
                    label='Away Team'
                    type='select'
                    form={form}
                    name='awayTeam'
                    placeholder='Select Away Team'
                    defaultValue={match?.awayTeam.split(':')[0]}
                    items={teams}
                    idFlag={true}
                  />
                </div>
                <div>
                  <FormArea
                    id='startDate'
                    label='Date'
                    type='date'
                    form={form}
                    name='startDate'
                    placeholder='Select date'
                    initialDate={match?.startDate}
                    isPortal={false}
                    time
                  />
                </div>
                <div className='flex items-center mt-7 p-5'>
                  <Button
                    type='submit'
                    className='bg-primary-500 hover:bg-purple-500'
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
