/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import ModalActions from '../../ModalActions';
import { leagueFormSchema } from '../../../lib/validation/LeagueValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const EditLeague = ({ row }) => {
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

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/league/edit/${row.original._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.status === 200) {
        window.location.reload();
      }
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
        data={row.original}
        form={form}
        fields={fields}
      />
    </div>
  );
};

export default EditLeague;
