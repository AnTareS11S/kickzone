import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import FormArea from '../FormArea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import { playerFormSchema } from '../../lib/validation/PlayerValidation';
import { Separator } from '../ui/separator';
import { useFetchPositions } from '../hooks/useFetchPositions';
import { useFetchCountries } from '../hooks/useFetchCountries';
import { useFetchTeams } from '../hooks/useFetchTeams';
import Spinner from '../Spinner';
import { useToast } from '../ui/use-toast';
import { useFetchPlayerByUserId } from '../hooks/useFetchPlayerByUserId';
import { Card } from '../ui/card';

const PlayerForm = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const [isChanged, setIsChanged] = useState(false);
  const positions = useFetchPositions();
  const countries = useFetchCountries();
  const teams = useFetchTeams();
  const {
    player: playerData,
    loading,
    currentUser,
  } = useFetchPlayerByUserId(isChanged);
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
      form.reset({
        name: playerData?.name || '',
        surname: playerData?.surname || '',
        wantedTeam: playerData?.wantedTeam || '',
        photo: playerData?.imageUrl || '',
        bio: playerData?.bio || '',
        height: playerData?.height || '',
        weight: playerData?.weight || '',
        age: playerData?.age || '',
        number: playerData?.number || '',
        footed: playerData?.footed || '',
        nationality: playerData?.nationality || '',
        position: playerData?.position || '',
      });
    }
  }, [playerData, form, isChanged]);

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

    const data = new FormData();

    data.append('photo', file || playerData?.photo);
    data.append('name', formData.name);
    data.append('surname', formData.surname);
    data.append('bio', formData.bio);
    data.append('height', formData.height);
    data.append('weight', formData.weight);
    data.append('age', formData.age);
    data.append('number', formData.number);
    data.append('footed', formData.footed);
    data.append(
      'nationality',
      countryId?.split(':')[1] || formData.nationality
    );
    data.append('position', positionId?.split(':')[1] || formData.position);
    data.append('wantedTeam', teamId?.split(':')[1] || formData.wantedTeam);
    data.append('user', currentUser?._id);

    try {
      const res = await fetch('/api/player/add', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Referee profile updated successfully',
        });
        setIsChanged(!isChanged);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update referee profile',
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
    <Card className='px-4 py-8'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType='multipart/form-data'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormArea
              id='name'
              label='Name'
              type='text'
              form={form}
              name='name'
              className='col-span-1'
            />
            <FormArea
              id='surname'
              label='Surname'
              type='text'
              form={form}
              name='surname'
              className='col-span-1'
            />
          </div>

          <div className='mt-6'>
            <FormArea
              id='photo'
              label='Photo'
              type='file'
              form={form}
              name='photo'
              fileRef={fileRef}
              setFile={setFile}
              currentUserPhoto={
                playerData?.imageUrl ||
                'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
              }
            />
          </div>

          <div className='mt-6'>
            <FormArea
              id='bio'
              label='Bio'
              type='textarea'
              form={form}
              name='bio'
              className='h-32'
            />
          </div>

          <div className='mt-6'>
            {playerData?.currentTeam ? (
              <FormArea
                id='currentTeam'
                type='text'
                form={form}
                isDisabled={true}
                placeholder={currentTeamName?.split(':')[0] || 'No team'}
                label='Current Team'
                name='currentTeam'
                className='bg-gray-100 cursor-not-allowed'
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
                className='w-full'
                idFlag={true}
              />
            )}
          </div>

          <div className='mt-6'>
            <FormArea
              id='nationality'
              type='select'
              form={form}
              items={countries}
              label='Nationality'
              placeholder={countryName?.split(':')[0] || 'Select Nationality'}
              name='nationality'
              className='w-full'
              idFlag={true}
            />
          </div>

          <Separator className='my-6' />

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            <FormArea
              id='height'
              label='Height'
              type='number'
              form={form}
              name='height'
              className='col-span-1'
            />
            <FormArea
              id='weight'
              label='Weight'
              type='number'
              form={form}
              name='weight'
              className='col-span-1'
            />
            <FormArea
              id='age'
              label='Age'
              type='number'
              form={form}
              name='age'
              className='col-span-1'
            />
            <FormArea
              id='position'
              label='Position'
              type='select'
              form={form}
              name='position'
              items={positions}
              placeholder={positionName?.split(':')[0] || 'Select Position'}
              idFlag={true}
              className='col-span-1'
            />
            <FormArea
              id='number'
              label='Number'
              type='number'
              form={form}
              name='number'
              className='col-span-1'
            />
            <FormArea
              id='footed'
              label='Footed'
              type='select'
              items={['Left:1', 'Right:2']}
              placeholder={playerData?.footed || 'Select Foot'}
              form={form}
              name='footed'
              idFlag={false}
              className='col-span-1'
            />
          </div>

          <div className='mt-8 flex justify-end'>
            <Button
              type='submit'
              className='bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded'
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default PlayerForm;
