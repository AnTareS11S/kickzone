import { useLocation } from 'react-router-dom';
import { Separator } from '../../components/ui/separator';
import BackButton from '../../components/BackButton';
import { useFetchMatchById } from '../../components/hooks/useFetchMatchById';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../components/ui/form';
import FormArea from '../../components/FormArea';
import { Button } from '../../components/ui/button';
import { resultFormSchema } from '../../lib/validation/ResultValidation';
import CrudPanel from '../../components/CrudPanel';
import { useToast } from '../../components/ui/use-toast';
import { useFetchMatchResultById } from '../../components/hooks/useFetchMatchResultById';
import { useEffect } from 'react';
import Spinner from '../../components/Spinner';

const columns = [
  {
    name: 'No.',
    selector: (row, index) => index + 1,
    grow: 0,
  },
  {
    name: 'Name',
    selector: (row) => row?.name,
    sortable: true,
  },
  {
    name: 'Surname',
    selector: (row) => row?.surname,
    sortable: true,
  },
  {
    name: 'Age',
    selector: (row) => row?.age,
    sortable: true,
    hide: 'max-md',
  },
  {
    name: 'Pos',
    selector: (row) => row?.positionShortcut,
    sortable: true,
  },
  {
    name: 'Number',
    selector: (row) => row?.number,
    sortable: true,
    hide: 'md',
  },
];

const AddResult = () => {
  const pathname = useLocation().pathname.split('/').pop();
  const { match } = useFetchMatchById(pathname);
  const { result, loading } = useFetchMatchResultById(pathname);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(resultFormSchema()),
    defaultValues: {
      homeTeamScore: 0,
      awayTeamScore: 0,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (result) {
      form.reset({
        homeTeamScore: result?.result?.homeTeamScore,
        awayTeamScore: result?.result?.awayTeamScore,
      });
    }
  }, [result, form]);

  const onSubmit = async (data) => {
    const updatedData = { ...data, match: match?._id, season: match?.season };
    try {
      const res = await fetch(`/api/referee/add-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Match result added successfully',
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to add match result',
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
      <div className='container mx-auto space-y-6'>
        <BackButton />
        <div>
          <div className='text-heading2-bold'>Match Details</div>
          <p className='text-sm text-muted-foreground'>
            Add match result here.
          </p>
        </div>
        <Separator />
        <div className='grid w-full'>
          <div>
            <div className='grid grid-cols-2 gap-4'>
              <p className='text-heading4-medium'>
                {new Date(match.startDate).toLocaleString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-row items-center gap-4 w-full mt-4 max-sm:grid-cols-1'
              >
                <FormArea
                  id='homeTeamScore'
                  label={`${match?.homeTeam?.name} Score`}
                  type='number'
                  form={form}
                  name='homeTeamScore'
                  styles='max-sm:w-[290px]'
                />
                <FormArea
                  id='awayTeamScore'
                  label={`${match?.awayTeam?.name} Score`}
                  type='number'
                  form={form}
                  name='awayTeamScore'
                  styles='max-sm:w-[290px]'
                />

                <Button
                  type='submit'
                  disabled={!form.formState.isValid}
                  className='w-[290px] bg-primary-500 hover:bg-purple-500 mt-6'
                >
                  Save
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <Separator />
        <div>
          <div className='text-heading2-bold'>Player Stats</div>
          <p className='text-sm text-muted-foreground'>
            Add player stats for this match.
          </p>
        </div>
        <Separator />
        <div>
          <div className='text-heading2-bold'>
            {match?.homeTeam?.name} players:
          </div>
          <CrudPanel
            apiPath='team-player'
            objectId={match?.homeTeam?._id}
            columns={columns}
            title='Player'
            formSchema={resultFormSchema}
            isAction={false}
            isExpandable={true}
          />
        </div>
        <Separator />
        <div>
          <div className='text-heading2-bold'>
            {match?.awayTeam?.name} players:
          </div>
          <CrudPanel
            apiPath='team-player'
            objectId={match?.awayTeam?._id}
            columns={columns}
            title='Player'
            formSchema={resultFormSchema}
            isAction={false}
            isExpandable={true}
          />
        </div>
      </div>
    </>
  );
};

export default AddResult;
