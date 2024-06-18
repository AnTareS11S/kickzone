import { useParams } from 'react-router-dom';
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
  const matchId = useParams().id;
  const { match, loading } = useFetchMatchById(matchId);
  const { result } = useFetchMatchResultById(matchId);
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
        homeTeamScore: result?.result?.homeTeamScore || 0,
        awayTeamScore: result?.result?.awayTeamScore || 0,
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
    return <Spinner />;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <BackButton />
      <div className='mt-8'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
          Match Details
        </h2>
        <div className='text-gray-600 flex flex-row justify-between'>
          <p>Add match result here.</p>
          <p>
            {match?.league?.name} / {match?.season?.name}
          </p>
        </div>
      </div>
      <Separator />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
        <div>
          <p className='text-lg font-semibold text-gray-800 mb-2'>Match Date</p>
          <p className='text-gray-600'>
            {new Date(match.startDate).toLocaleString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col items-end max-sm:items-start max-md:items-start'>
                <FormArea
                  id='homeTeamScore'
                  label={`${match?.homeTeam?.name} Score`}
                  type='number'
                  form={form}
                  name='homeTeamScore'
                  className='w-auto'
                />

                <FormArea
                  id='awayTeamScore'
                  label={`${match?.awayTeam?.name} Score`}
                  type='number'
                  form={form}
                  name='awayTeamScore'
                  className='w-auto'
                />
              </div>
              <div className='flex flex-col md:flex-row justify-end max-sm:w-fit max-md:w-fit'>
                <Button
                  type='submit'
                  disabled={!form.formState.isValid}
                  className='w-auto bg-primary-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded mt-4 md:mt-0'
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <Separator />
      <div className='mt-8'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
          Player Stats
        </h2>
        <p className='text-sm text-gray-600 mb-6'>
          Add player stats for this match.
        </p>
      </div>
      <Separator />
      {match?.homeTeam ? (
        <div className='mt-8'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>
            {match?.homeTeam?.name} players:
          </h3>
          <CrudPanel
            apiPath={`team-player/${match?.homeTeam?._id}`}
            columns={columns}
            title='Player'
            formSchema={resultFormSchema}
            isAction={false}
            isExpandable={true}
          />
        </div>
      ) : null}
      <Separator />
      {match?.awayTeam ? (
        <div className='mt-8'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>
            {match?.awayTeam?.name} players:
          </h3>
          <CrudPanel
            apiPath={`team-player/${match?.awayTeam?._id}`}
            columns={columns}
            title='Player'
            formSchema={resultFormSchema}
            isAction={false}
            isExpandable={true}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AddResult;
