/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import ModalActions from '../../ModalActions';
import { useForm } from 'react-hook-form';

const AddTeam = ({ row }) => {
  const [teams, setTeams] = useState([]);
  const form = useForm({
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  });

  const getTeamId = (teamName) => {
    const selectedTeam = teams.find((team) => team.startsWith(teamName));
    return selectedTeam ? selectedTeam.split(':')[1] : '';
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(
          `/api/admin/teams/no-league/${row.original._id}`
        );
        const data = await res.json();
        const teamss = data?.map((team) => team.name + ':' + team._id);
        setTeams(teamss);
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    fetchTeams();
  }, [row.original._id]);

  const fields = [
    {
      id: 'names',
      label: 'Name',
      type: 'select',
      name: 'names',
      items: teams,
      placeholder: 'Select a team',
    },
  ];

  const onSubmit = async (formData) => {
    console.log(formData);
    const teamId = getTeamId(formData.names);

    try {
      const res = await fetch(`/api/league/addTeam/${row.original._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
      });
      const data = await res.json();

      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log('Error updating team: ', error);
    }
  };

  return (
    <div>
      <ModalActions
        onSubmit={onSubmit}
        label='Add'
        add={true}
        title='Add Team'
        desc='Add team to the league'
        data={row.original}
        form={form}
        fields={fields}
      />
    </div>
  );
};

export default AddTeam;
