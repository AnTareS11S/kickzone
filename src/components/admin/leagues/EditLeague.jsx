/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import ModalActions from '../../ModalActions';
import { leagueFormSchema } from '../../../lib/validation/LeagueValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFetchCountries } from '../../hooks/useFetchCountries';
import { useState } from 'react';
import { useOnSuccessUpdate } from '../../hooks/useOnSuccessUpdate';

const EditLeague = ({ row, onLeagueUpdated }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const countries = useFetchCountries();

  const form = useForm({
    resolver: zodResolver(leagueFormSchema(true)),
    defaultValues: {
      name: '',
      commissioner: '',
      bio: '',
      country: '',
    },
    mode: 'onChange',
  });

  useOnSuccessUpdate(updateSuccess, () => {
    onLeagueUpdated();
    setUpdateSuccess(false);
  });

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/league/edit/${row._id}`, {
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
    } catch (error) {
      console.log('Error updating team: ', error);
    }
  };

  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      name: 'name',
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
      id: 'commissioner',
      label: 'Commissioner',
      type: 'text',
      name: 'commissioner',
    },
    {
      id: 'bio',
      label: 'Bio',
      type: 'textarea',
      name: 'bio',
    },
  ];

  return (
    <div>
      <ModalActions
        onSubmit={onSubmit}
        label='Edit'
        edit='true'
        title='Edit League'
        desc='Edit a league'
        data={row}
        form={form}
        fields={fields}
      />
    </div>
  );
};

export default EditLeague;
