import { useLocation } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import FormArea from '../../components/FormArea';
import { Form } from '../../components/ui/form';
import { Separator } from '../../components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resultFormSchema } from '../../lib/validation/ResultValidation';
import { useFetchMatchResultById } from '../../components/hooks/useFetchMatchResultById';
import Spinner from '../../components/Spinner';
import CrudPanel from '../../components/CrudPanel';
import { useToast } from '../../components/ui/use-toast';

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

const EditResult = () => {
  const pathname = useLocation().pathname.split('/')[6];
  const [isEdited, setIsEdited] = useState(false);
  const { result, loading } = useFetchMatchResultById(pathname, isEdited);
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
    try {
      const res = await fetch(
        `/api/referee/edit-result/${result?.result?._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (res.ok) {
        setIsEdited(true);
        toast({
          title: 'Success!',
          description: 'Match result updated successfully',
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update match result',
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
            Edit match result here.
          </p>
        </div>
        <Separator />

        <div className='flex flex-col'>
          <div>
            <div>
              <div className='grid grid-cols-2 gap-4'>
                <p className='text-heading4-medium'>
                  {new Date(result?.match?.startDate).toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </p>
              </div>
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
                  label={`${result?.match?.homeTeam?.name} Score`}
                  type='number'
                  form={form}
                  name='homeTeamScore'
                  styles='max-sm:w-[290px]'
                />
                <FormArea
                  id='awayTeamScore'
                  label={`${result?.match?.awayTeam?.name} Score`}
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
          <div className='text-heading2-bold'>
            {result?.match?.homeTeam?.name} players:
          </div>
          <CrudPanel
            apiPath='team-player'
            objectId={result?.match?.homeTeam?._id}
            columns={columns}
            title='Player'
            formSchema={resultFormSchema}
            isAction={false}
            isExpandable={true}
            isEdited={true}
          />
        </div>
        <Separator />
        <div>
          <div className='text-heading2-bold'>
            {result?.match?.awayTeam?.name} players:
          </div>
          <CrudPanel
            apiPath='team-player'
            objectId={result?.match?.awayTeam?._id}
            columns={columns}
            title='Player'
            formSchema={resultFormSchema}
            isAction={false}
            isExpandable={true}
            isEdited={true}
          />
        </div>
      </div>
    </>
  );
};

export default EditResult;
