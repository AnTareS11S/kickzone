import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import FormArea from '../FormArea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import uploadFile from '../../lib/uploadFile';
import { playerFormSchema } from '../../lib/validation/PlayerValidation';
import { Separator } from '../ui/separator';
import { useFetchPositions } from '../hooks/useFetchPositions';
import { useFetchCountries } from '../hooks/useFetchCountries';
import { useFetchTeams } from '../hooks/useFetchTeams';
import Spinner from '../Spinner';
import { useToast } from '../ui/use-toast';
import { useFetchPlayerByUserId } from '../hooks/useFetchPlayerByUserId';

const PlayerForm = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const positions = useFetchPositions();
  const countries = useFetchCountries();
  const teams = useFetchTeams();
  const { player: playerData, loading, currentUser } = useFetchPlayerByUserId();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(playerFormSchema()),
    defaultValues: {
      name: '',
      surname: '',
      nationality: '',
      wantedTeam: '',
      height: '',
      weight: '',
      position: '',
      number: '',
      footed: '',
      photo: '',
      age: '',
      bio: '',
    },
    mode: 'onChange',
  });

  const positionName = positions?.find((position) =>
    position.split(':')[1].includes(playerData?.position)
  );

  const countryName = countries?.find((country) =>
    country.split(':')[1].includes(playerData?.nationality)
  );

  const teamName = teams?.find((team) =>
    team.split(':')[1].includes(playerData?.wantedTeam)
  );

  const currentTeamName = teams?.find((team) =>
    team.split(':')[1].includes(playerData?.currentTeam)
  );

  useEffect(() => {
    if (playerData) {
      form.reset({ ...playerData, currentTeam: '' });
    }
  }, [playerData, form]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    const timeoutId = setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSuccess, file]);

  const handleFileUpload = async (file) => {
    try {
      const downloadURL = await uploadFile(file);
      form.setValue('photo', downloadURL);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  const onSubmit = async (formData) => {
    const countryId = countries.find((country) =>
      country.split(':')[1].includes(formData?.nationality)
    );

    const positionId = positions.find((position) =>
      position.split(':')[1].includes(formData?.position)
    );

    const teamId = teams.find((team) =>
      team.split(':')[1].includes(formData?.wantedTeam)
    );

    const updatedData = {
      ...formData,
      user: currentUser?._id,
      nationality: countryId?.split(':')[1],
      position: positionId?.split(':')[1],
      wantedTeam: teamId?.split(':')[1],
      photo: form?.getValues('photo') || '',
    };
    try {
      const res = await fetch('/api/player/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Referee profile updated successfully',
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update referee profile',
          variant: 'destructive',
        });
      }
      setUpdateSuccess(true);
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col space-y-4'
      >
        <FormArea id='name' label='Name' type='text' form={form} name='name' />
        <FormArea
          id='surname'
          label='Surname'
          type='text'
          form={form}
          name='surname'
        />

        <FormArea
          id='photo'
          label='Photo'
          type='file'
          form={form}
          name='photo'
          fileRef={fileRef}
          setFile={setFile}
          currentUserPhoto={playerData?.photo}
        />
        <FormArea id='bio' label='Bio' type='textarea' form={form} name='bio' />
        {playerData?.currentTeam ? (
          <FormArea
            id='currentTeam'
            type='text'
            form={form}
            isDisabled={true}
            placeholder={currentTeamName?.split(':')[0] || 'No team'}
            label='Current Team'
            name='currentTeam'
          />
        ) : (
          <FormArea
            id='wantedTeam'
            type='select'
            form={form}
            items={teams}
            label='Team where you play/you want to play'
            placeholder={teamName?.split(':')[0] || 'Select Team'}
            name='wantedTeam'
            className='w-full '
            idFlag={true}
          />
        )}
        <FormArea
          id='nationality'
          type='select'
          form={form}
          items={countries}
          label='Nationality'
          placeholder={countryName?.split(':')[0] || 'Select Nationality'}
          name='nationality'
          className='w-full '
          idFlag={true}
        />
        <Separator />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 items-center justify-between'>
          <div className='flex flex-col w-full'>
            <FormArea
              id='height'
              label='Height'
              type='number'
              form={form}
              name='height'
            />
          </div>
          <div className='flex flex-col w-full'>
            <FormArea
              id='weight'
              label='Weight'
              type='number'
              form={form}
              name='weight'
            />
          </div>
          <div className='flex flex-col w-full'>
            <FormArea
              id='age'
              label='Age'
              type='number'
              form={form}
              name='age'
            />
          </div>
          <div className='flex flex-col w-full'>
            <FormArea
              id='position'
              label='Position'
              type='select'
              form={form}
              name='position'
              items={positions}
              placeholder={positionName?.split(':')[0] || 'Select Position'}
              idFlag={true}
            />
          </div>
          <div className='flex flex-col w-full'>
            <FormArea
              id='number'
              label='Number'
              type='number'
              form={form}
              name='number'
            />
          </div>
          <div className='flex flex-col w-full'>
            <FormArea
              id='footed'
              label='Footed'
              type='select'
              items={['Left:1', 'Right:2']}
              placeholder={playerData?.footed || 'Select Foot'}
              form={form}
              name='footed'
              idFlag={false}
            />
          </div>
        </div>

        <div className='flex justify-start items-center'>
          <Button type='submit' className='bg-primary-500 hover:bg-purple-500'>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PlayerForm;
