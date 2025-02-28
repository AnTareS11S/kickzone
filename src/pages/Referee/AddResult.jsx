import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../components/ui/form';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { useToast } from '../../components/ui/use-toast';
import BackButton from '../../components/BackButton';
import FormArea from '../../components/FormArea';
import CrudPanel from '../../components/CrudPanel';
import Spinner from '../../components/Spinner';
import { resultFormSchema } from '../../lib/validation/ResultValidation';
import { GetMatchById } from '../../api/getMatchById';
import { GetMatchResultById } from '../../api/getMatchResultById';

const columns = [
  { name: 'No.', selector: (row, index) => index + 1, grow: 0 },
  { name: 'Name', selector: (row) => row?.name, sortable: true },
  { name: 'Surname', selector: (row) => row?.surname, sortable: true },
  { name: 'Age', selector: (row) => row?.age, sortable: true, hide: 'sm' },
  { name: 'Pos', selector: (row) => row?.positionShortcut, sortable: true },
  {
    name: 'Number',
    selector: (row) => row?.number,
    sortable: true,
    hide: 'md',
  },
];

const AddResult = () => {
  const { id: matchId } = useParams();
  const { match, loading } = GetMatchById(matchId);
  const { result } = GetMatchResultById(matchId);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(resultFormSchema()),
    defaultValues: { homeTeamScore: 0, awayTeamScore: 0 },
    mode: 'onChange',
  });

  useEffect(() => {
    if (result) {
      form.reset({
        homeTeamScore: result?.result?.homeTeamScore || 0,
        awayTeamScore: result?.result?.awayTeamScore || 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/referee/add-result`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            match: match?._id,
            season: match?.season,
          }),
        }
      );

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
      console.error('Error adding match result:', error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <BackButton />
      <div className='mt-8 bg-white shadow-lg rounded-lg overflow-hidden'>
        <div className='px-6 py-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Match Details
          </h2>
          <div className='flex flex-col sm:flex-row justify-between text-gray-600 mb-6'>
            <p className='mb-2 sm:mb-0'>Add match result here.</p>
            <p>
              {match?.league?.name} / {match?.season?.name}
            </p>
          </div>
          <Separator className='my-6' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
            <div>
              <p className='text-lg font-semibold text-gray-800 mb-2'>
                Match Date
              </p>
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormArea
                  id='homeTeamScore'
                  label={`${match?.homeTeam?.name} Score`}
                  type='number'
                  form={form}
                  name='homeTeamScore'
                />
                <FormArea
                  id='awayTeamScore'
                  label={`${match?.awayTeam?.name} Score`}
                  type='number'
                  form={form}
                  name='awayTeamScore'
                />
                <Button
                  type='submit'
                  disabled={!form.formState.isValid}
                  className='w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300'
                >
                  Save Result
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <div className='mt-12 bg-white shadow-lg rounded-lg overflow-hidden'>
        <div className='px-6 py-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Player Stats
          </h2>
          <p className='text-sm text-gray-600 mb-6'>
            Add player stats for this match.
          </p>
          <Separator className='my-6' />
          {match?.homeTeam && (
            <div className='mb-8'>
              <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
                {match.homeTeam.name} players:
              </h3>
              <CrudPanel
                apiPath={`team-player/${match.homeTeam._id}`}
                columns={columns}
                title='Player'
                formSchema={resultFormSchema}
                isAction={false}
                isExpandable={true}
              />
            </div>
          )}
          {match?.awayTeam && (
            <div className='mt-8'>
              <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
                {match.awayTeam.name} players:
              </h3>
              <CrudPanel
                apiPath={`team-player/${match.awayTeam._id}`}
                columns={columns}
                title='Player'
                formSchema={resultFormSchema}
                isAction={false}
                isExpandable={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddResult;
