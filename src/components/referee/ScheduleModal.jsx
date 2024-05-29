import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormArea from '../FormArea';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

import { useForm } from 'react-hook-form';
import { Form } from '../ui/form';
import { useToast } from '../ui/use-toast';

const schema = z.object({
  homeTeam: z.string().min(1, { message: 'Home team is required' }),
  awayTeam: z.string().min(1, { message: 'Away team is required' }),
  startDate: z.coerce.date().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      return date.getTime() >= today.getTime();
    },
    {
      message: 'Date must be in the future or today',
    }
  ),
});

const ScheduleModal = ({ match, teams }) => {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      homeTeam: match?.homeTeam,
      awayTeam: match?.awayTeam,
      startDate: match?.startDate,
    },
    mode: 'onChange',
  });

  const originalDate = form.getValues('startDate');
  const formattedDate = new Date(originalDate);

  const onSubmit = async (data) => {
    const updatedData = {
      ...data,
      homeTeam: data?.homeTeam?.split(':')[1]
        ? data?.homeTeam?.split(':')[1]
        : data?.homeTeam,
      awayTeam: data?.awayTeam?.split(':')[1]
        ? data?.awayTeam?.split(':')[1]
        : data?.awayTeam,
      startDate: formattedDate,
    };

    try {
      const res = await fetch(`/api/referee/edit-match/${match?.matchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Match updated successfully',
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update match',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary' className='w-32'>
          Edit Match
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] h-auto'>
        <DialogHeader>
          <DialogTitle>Edit Match</DialogTitle>
          <DialogDescription>
            Make changes to this match here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='p-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div>
                <FormArea
                  id='homeTeam'
                  label='Home Team'
                  type='select'
                  form={form}
                  name='homeTeam'
                  placeholder={
                    match?.homeTeam.split(':')[0] || 'Select Home Team'
                  }
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
                  placeholder={
                    match?.awayTeam.split(':')[0] || 'Select Away Team'
                  }
                  items={teams}
                  idFlag={true}
                />
              </div>
              <div>
                <FormArea
                  id='startDate'
                  label='Start Date'
                  type='date'
                  form={form}
                  name='startDate'
                  placeholder='Select date'
                  initialDate={match?.startDate}
                  isEdit={true}
                  isPortal={false}
                  time
                />
              </div>
            </div>

            <div className='flex justify-end mt-4'>
              <DialogClose asChild>
                <Button
                  type='submit'
                  className='bg-primary-500 text-white hover:bg-purple-500 px-4 py-2 rounded-md'
                >
                  Save
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
