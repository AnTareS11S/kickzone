/* eslint-disable react/prop-types */
import { useState } from 'react';
import ModalActions from '../../ModalActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stadiumFormSchema } from '../../../lib/validation/StadiumValidation';
import { useFetchCountries } from '../../hooks/useFetchCountries';
import { useOnSuccessUpdate } from '../../hooks/useOnSuccessUpdate';

const EditStadium = ({ row, onStadiumUpdated }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const countries = useFetchCountries();

  const form = useForm({
    resolver: zodResolver(stadiumFormSchema(true)),
    defaultValues: {
      name: '',
      capacity: '',
      country: '',
      city: '',
      location: '',
      history: '',
    },
    mode: 'onChange',
  });

  useOnSuccessUpdate(updateSuccess, () => {
    onStadiumUpdated();
    setUpdateSuccess(false);
  });

  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
    {
      id: 'capacity',
      label: 'Capacity',
      type: 'number',
      name: 'capacity',
    },
    {
      id: 'country',
      label: 'Country',
      type: 'select',
      name: 'country',
      items: countries,
      defaultValue: countries.find(
        (country) => country.split(':')[1] === row.country
      ),
      placeholder: 'Select a Country',
      idFlag: true,
    },
    {
      id: 'city',
      label: 'City',
      type: 'text',
      name: 'city',
    },
    {
      id: 'location',
      label: 'Location',
      type: 'text',
      name: 'location',
    },
    {
      id: 'history',
      label: 'History',
      type: 'textarea',
      name: 'history',
    },
  ];

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/admin/stadium/edit/${row._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to edit stadium!');
      }

      setUpdateSuccess(true);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalActions
      onSubmit={onSubmit}
      label='Edit'
      edit='true'
      title='Edit Stadium'
      desc='Edit a Stadium'
      data={row}
      form={form}
      fields={fields}
    />
  );
};

export default EditStadium;
