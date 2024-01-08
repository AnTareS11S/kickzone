/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import ModalActions from '../../ModalActions';
import { fetchCoaches } from '../../../lib/apiUtils';
import { teamFormSchema } from '../../../lib/validation/TeamValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFetchCountries } from '../../hooks/useFetchCountries';
import { useOnSuccessUpdate } from '../../hooks/useOnSuccessUpdate';

const EditTeam = ({ row, onTeamUpdated }) => {
  const [coaches, setCoaches] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const countries = useFetchCountries();
  const coach = row.coach;

  useOnSuccessUpdate(updateSuccess, () => {
    onTeamUpdated();
    setUpdateSuccess(false);
  });

  const getCoachId = (coachName) => {
    const selectedCoach = coaches.find((coach) => coach.startsWith(coachName));
    return selectedCoach ? selectedCoach.split(':')[1] : '';
  };

  const form = useForm({
    resolver: zodResolver(teamFormSchema(true)),
    defaultValues: {
      name: '',
      coach: '',
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
      const res = await fetch(`/api/team/edit/${row._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeam),
      });
      const data = await res.json();
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
  ];

  return (
    <div>
      <ModalActions
        onSubmit={onSubmit}
        label='Edit'
        edit='true'
        title='Edit Team'
        desc='Edit a team'
        data={row}
        coaches={coaches}
        coach={coach}
        form={form}
        fields={fields}
      />
    </div>
  );
};

export default EditTeam;
