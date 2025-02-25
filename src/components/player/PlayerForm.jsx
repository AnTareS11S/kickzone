import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import FormArea from '../FormArea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import { playerFormSchema } from '../../lib/validation/PlayerValidation';
import { Separator } from '../ui/separator';
import Spinner from '../Spinner';
import { useToast } from '../ui/use-toast';
import { Card } from '../ui/card';
import { FaQuestionCircle } from 'react-icons/fa';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { useDispatch } from 'react-redux';
import { updateProfileFilled } from '../../redux/user/userSlice';
import { GetCountries } from '../../api/getCountries';
import { GetPlayerByUserId } from '../../api/getPlayerByUserId';
import { GetPositions } from '../../api/getPositions';
import { GetTeams } from '../../api/getTeams';

const PlayerForm = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const [isChanged, setIsChanged] = useState(false);
  const positions = GetPositions();
  const countries = GetCountries();
  const teams = GetTeams();
  const {
    player: playerData,
    loading,
    currentUser,
  } = GetPlayerByUserId(isChanged);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(playerFormSchema(playerData ? true : false)),
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
    position.id.includes(playerData?.position)
  );

  const countryName = countries?.find((country) =>
    country.id.includes(playerData?.nationality)
  );

  const teamName = teams?.find((team) =>
    team.id.includes(playerData?.wantedTeam)
  );

  useEffect(() => {
    if (playerData) {
      form.reset({
        ...playerData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerData, isChanged]);

  const onSubmit = async (formData) => {
    const countryId = countries.find((country) =>
      country.id.includes(formData?.nationality)
    );

    const positionId = positions.find((position) =>
      position.id.includes(formData?.position)
    );

    const teamId = teams.find((team) => team.id.includes(formData?.wantedTeam));

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
    data.append('nationality', countryId?.id || formData.nationality);
    data.append('position', positionId?.id || formData.position);
    data.append('wantedTeam', teamId?.id || formData.wantedTeam);
    data.append('user', currentUser?._id);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/player/add`,
        {
          method: 'POST',
          body: data,
        }
      );

      if (res.ok) {
        dispatch(updateProfileFilled(true));
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
              <div className='relative'>
                <FormArea
                  id='currentTeam'
                  label='Current Team'
                  name='currentTeam'
                  type='select'
                  form={form}
                  isDisabled={true}
                  placeholder={playerData?.currentTeam?.name || 'No team'}
                  className='bg-gray-100 cursor-not-allowed'
                />
                <div className='absolute top-0 right-0 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full cursor-pointer group'>
                  <HoverCard>
                    <HoverCardTrigger>
                      <FaQuestionCircle className='text-gray-500' />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      To change your current team, please contact your coach to
                      remove you from it.
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            ) : (
              <div className='relative'>
                <FormArea
                  id='wantedTeam'
                  type='select'
                  form={form}
                  items={teams}
                  label='Team where you play/you want to play'
                  placeholder={teamName?.name || 'Select Team'}
                  name='wantedTeam'
                  className='w-full'
                  idFlag={true}
                />
                <div className='absolute top-0 right-0 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full cursor-pointer group'>
                  <HoverCard>
                    <HoverCardTrigger>
                      <FaQuestionCircle className='text-gray-500' />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      If you choose a team, the coach will be notified and will
                      add you to it.
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            )}
          </div>

          <div className='mt-6'>
            <FormArea
              id='nationality'
              type='select'
              form={form}
              items={countries}
              label='Nationality'
              placeholder={countryName?.name || 'Select Nationality'}
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
              placeholder={positionName?.name || 'Select Position'}
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
              className='bg-primary-500 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded'
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
