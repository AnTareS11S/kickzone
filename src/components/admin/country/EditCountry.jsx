/* eslint-disable react/prop-types */
import ModalActions from '../../ModalActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { countryFormSchema } from '../../../lib/validation/CountryValidation';
import { useEffect, useState } from 'react';

const EditCountry = ({ row, onCountryUpdated }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(countryFormSchema(true)),
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (updateSuccess) {
      onCountryUpdated();
      setUpdateSuccess(false);
    }
  }, [updateSuccess, onCountryUpdated]);

  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
    },
  ];

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/admin/country/edit/${row._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch data!');
      }
      const data = await res.json();
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
      title='Edit Country'
      desc='Edit a Country'
      data={row}
      form={form}
      fields={fields}
    />
  );
};

export default EditCountry;
