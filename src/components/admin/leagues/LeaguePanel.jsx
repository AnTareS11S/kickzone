/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ModalActions from '../../ModalActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leagueFormSchema } from '../../../lib/validation/LeagueValidation';
import CustomDataTable from '../../CustomDataTable';
import { useFetchCountries } from '../../hooks/useFetchCountries';
import EditLeague from './EditLeague';
import DeleteLeague from './DeleteLeague';
import RemoveTeamFromLeague from './RemoveTeamFromLeague';
import AddTeam from './AddTeam';

const LeaguePanel = () => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [tableData, setTableData] = useState([]);
  const countries = useFetchCountries();

  const form = useForm({
    resolver: zodResolver(leagueFormSchema(false)),
    defaultValues: {
      name: '',
      bio: '',
      commissioner: '',
      country: '',
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
      name: 'League',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Teams',
      selector: (row) => row.teams.length,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => {
        const teams = row?.teams.map((team) => team?._id);

        return (
          <div className='flex items-center space-x-4'>
            <EditLeague row={row} onLeagueUpdated={handleLeagueUpdated} />
            <AddTeam row={row} onLeagueUpdated={handleLeagueUpdated} />
            <RemoveTeamFromLeague
              row={row}
              teams={teams}
              onLeagueUpdated={handleLeagueUpdated}
            />
            <DeleteLeague row={row} onLeagueUpdated={handleLeagueUpdated} />
          </div>
        );
      },
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
      id: 'country',
      label: 'Country',
      type: 'select',
      name: 'country',
      items: countries,
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

  const getLeagues = async () => {
    try {
      const res = await fetch('/api/admin/leagues');
      const data = await res.json();
      setTableData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeagues();
    setUpdateSuccess(false);
  }, [updateSuccess]);

  const onSubmit = async (formData) => {
    try {
      const res = await fetch('/api/league/add', {
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

  const handleLeagueUpdated = () => {
    getLeagues();
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
      <CustomDataTable columns={columns} data={tableData} pending />
    </>
  );
};

export default LeaguePanel;
