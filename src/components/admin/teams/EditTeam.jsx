/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ModalActions from '../../ModalActions';
import { fetchCoaches } from '../../../lib/apiUtils';
import { teamFormSchema } from '../../../lib/validation/TeamValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const EditTeam = ({ row }) => {
  const [coaches, setCoaches] = useState([]);
  const coach = row.getValue('coach');

  const getCoachId = (coachName) => {
    const selectedCoach = coaches.find((coach) => coach.startsWith(coachName));
    return selectedCoach ? selectedCoach.split(':')[1] : '';
  };

  const form = useForm({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      coach: '',
      league: '',
      city: '',
      country: '',
      yearFounded: '',
      logo: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchCoachesData = async () => {
      const coachesData = await fetchCoaches();
      setCoaches(coachesData);
    };
    fetchCoachesData();
  }, []);

  const onSubmit = async (formData) => {
    const coachId = getCoachId(formData.coach);

    const updatedTeam = {
      ...formData,
      coach: coachId ? coachId : formData.coach,
    };

    try {
      const res = await fetch(`/api/team/edit/${row.original._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeam),
      });
      const data = await res.json();
      console.log('data: ', data);

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
      id: 'logo',
      label: 'Logo',
      type: 'file',
      name: 'logo',
    },
    {
      id: 'bio',
      label: 'Bio',
      type: 'textarea',
      name: 'bio',
    },
    {
      id: 'coach',
      label: 'Coach',
      type: 'select',
      name: 'coach',
      items: coaches,
      placeholder: coach,
      idFlag: true,
    },
    {
      id: 'stadium',
      label: 'Stadium',
      type: 'select',
      name: 'stadium',
    },
    {
      id: 'yearFounded',
      label: 'Founded Year',
      type: 'number',
      name: 'yearFounded',
    },
    {
      id: 'country',
      label: 'Country',
      type: 'select',
      name: 'country',
    },
    {
      id: 'city',
      label: 'City',
      type: 'text',
      name: 'city',
    },
  ];

  return (
    <div>
      <ModalActions
        onSubmit={onSubmit}
        label='Edit'
        edit='true'
        title='Edit Team'
        desc='Edit a team'
        data={row.original}
        coaches={coaches}
        coach={coach}
        form={form}
        fields={fields}
      />
    </div>
  );
};

export default EditTeam;
