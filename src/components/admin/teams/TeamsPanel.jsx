/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import ModalActions from '../../ModalActions';
import { fetchCoaches } from '../../../lib/apiUtils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teamFormSchema } from '../../../lib/validation/TeamValidation';

import CustomDataTable from '../../CustomDataTable';
import { useFetchCountries } from '../../hooks/useFetchCountries';
import EditTeam from './EditTeam';
import DeleteTeam from './DeleteTeam';

const TeamsPanel = () => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [teams, setTeams] = useState([]);
  const countries = useFetchCountries();

  const form = useForm({
    resolver: zodResolver(teamFormSchema(false)),
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

  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'Team',
      selector: (row) => row.name,
      sortable: true,
    },

    {
      name: 'Coach',
      selector: (row) => row.coach,
      sortable: true,
    },
    {
      name: 'Year Founded',
      selector: (row) => row.yearFounded,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => {
        return (
          <div className='flex items-center space-x-4'>
            <EditTeam row={row} onTeamUpdated={handleTeamUpdated} />
            <DeleteTeam row={row} onTeamUpdated={handleTeamUpdated} />
          </div>
        );
      },
      grow: 0,
    },
  ];

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
      placeholder: 'Select a coach',
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

  const getTeams = async () => {
    try {
      const res = await fetch('/api/admin/teams');
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    getTeams();
    setUpdateSuccess(false);
  }, [updateSuccess]);

  useEffect(() => {
    const fetchCoachesData = async () => {
      const coachesData = await fetchCoaches();
      setCoaches(coachesData);
    };

    fetchCoachesData();
  }, []);

  const onSubmit = async (formData) => {
    try {
      const res = await fetch('/api/team/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUpdateSuccess(true);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTeamUpdated = () => {
    getTeams();
  };

  return (
    <>
      <ModalActions
        label='Add'
        onSubmit={onSubmit}
        title='Add League'
        desc='Add a new league'
        form={form}
        fields={fields}
      />
      <CustomDataTable columns={columns} data={teams} pending pagination />
    </>
  );
};

export default TeamsPanel;
