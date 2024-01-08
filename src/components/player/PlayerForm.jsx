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

const PlayerForm = ({ currentUser, playerData }) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(playerFormSchema),
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

  const countries = ['Albania', 'Andorra', 'Austria', 'Poland', 'Portugal'];

  const onSubmit = async (formData) => {
    const updatedData = {
      ...formData,
      user: currentUser._id,
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
          placeholder={playerData?.nationality || 'Select Nationality'}
          name='nationality'
          className='w-full '
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
              type='text'
              form={form}
              name='position'
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
              items={['Left', 'Right']}
              form={form}
              name='footed'
            />
          </div>
        </div>

        <div className='flex justify-start items-center'>
          <Button type='submit' disabled={!form.formState.isValid}>
            Save
          </Button>
          {updateSuccess && <p className='text-green-700 ml-3'>Saved</p>}
        </div>
      </form>
    </Form>
  );
};

export default PlayerForm;
