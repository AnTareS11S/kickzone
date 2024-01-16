/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
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

const PlayerForm = ({ currentUser, playerData }) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const positions = useFetchPositions();
  const countries = useFetchCountries();

  const form = useForm({
    resolver: zodResolver(playerFormSchema(false)),
    defaultValues: {
      name: '',
      surname: '',
      nationality: '',
      height: '',
      weight: '',
      position: '',
      number: '',
      footed: '',
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

  useEffect(() => {
    if (playerData) {
      form.reset({
        name: playerData.name,
        surname: playerData.surname,
        nationality: playerData.nationality,
        height: playerData.height,
        weight: playerData.weight,
        position: playerData.position,
        number: playerData.number,
        footed: playerData.footed,
        age: playerData.age,
        bio: playerData.bio,
        photo: playerData.photo,
      });
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

    const updatedData = {
      ...formData,
      user: currentUser._id,
      nationality: countryId?.split(':')[1],
      position: positionId?.split(':')[1],
      photo: form.getValues('photo'),
    };
    try {
      const res = await fetch('/api/player/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

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
          {updateSuccess && <p className='text-green-700 ml-3'>Saved</p>}
        </div>
      </form>
    </Form>
  );
};

export default PlayerForm;
