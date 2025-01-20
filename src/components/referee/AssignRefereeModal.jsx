import FormArea from '../FormArea';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '../ui/use-toast';
import { useEffect, useState } from 'react';

const schema = z
  .object({
    mainReferee: z.string().min(1, { message: 'Main Referee is required' }),
    firstAssistantReferee: z
      .string()
      .min(1, { message: 'First Assistant is required' }),
    secondAssistantReferee: z
      .string()
      .min(1, { message: 'Second Assistant is required' }),
  })
  .refine((data) => data.mainReferee !== data.firstAssistantReferee, {
    message:
      'Main Referee and First Assistant Referee cannot be the same person',
    path: ['firstAssistantReferee'],
  })
  .refine((data) => data.mainReferee !== data.secondAssistantReferee, {
    message:
      'Main Referee and Second Assistant Referee cannot be the same person',
    path: ['secondAssistantReferee'],
  })
  .refine(
    (data) => data.firstAssistantReferee !== data.secondAssistantReferee,
    {
      message:
        'First Assistant Referee and Second Assistant Referee cannot be the same person',
      path: ['secondAssistantReferee'],
    }
  );

const AssignRefereeModal = ({ match, referees, isSet }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      mainReferee: '',
      firstAssistantReferee: '',
      secondAssistantReferee: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (match?.mainReferee) {
      form.setValue('mainReferee', match?.mainReferee.id);
      form.setValue('firstAssistantReferee', match?.firstAssistantReferee?.id);
      form.setValue('secondAssistantReferee', match?.secondAssistantReferee.id);
    }
  }, [match, form]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `/api/referee/assign-referees/${match?.matchId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Referees assigned successfully',
        });
        setOpen(false);
        isSet(true);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to assign referees',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='w-32'>
          Assign Referee
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] h-auto'>
        <DialogHeader>
          <DialogTitle>Assign Referee</DialogTitle>
          <DialogDescription>
            Assign referees to matches here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='p-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div>
                <FormArea
                  id='mainReferee'
                  label='Main Referee'
                  type='select'
                  form={form}
                  name='mainReferee'
                  items={referees}
                  placeholder={
                    match?.mainReferee?.name || 'Select Main Referee'
                  }
                  idFlag={true}
                />
              </div>
              <div>
                <FormArea
                  id='firstAssistantReferee'
                  label='First Assistant'
                  type='select'
                  form={form}
                  name='firstAssistantReferee'
                  placeholder={
                    match?.firstAssistantReferee?.name ||
                    'Select First Assistant'
                  }
                  items={referees}
                  idFlag={true}
                />
              </div>
              <div>
                <FormArea
                  id='secondAssistantReferee'
                  label='Second Assistant'
                  type='select'
                  form={form}
                  name='secondAssistantReferee'
                  placeholder={
                    match?.secondAssistantReferee?.name ||
                    'Select Second Assistant'
                  }
                  items={referees}
                  idFlag={true}
                />
              </div>
            </div>

            <div className='flex justify-end mt-4'>
              <DialogFooter>
                <Button
                  type='submit'
                  className='bg-primary-500 text-white hover:bg-purple-500 hover:text-white'
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRefereeModal;
