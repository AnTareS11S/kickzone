import { useEffect, useState } from 'react';
import ModalActions from '../../ModalActions';
import { useForm } from 'react-hook-form';
import { useOnSuccessUpdate } from '../../hooks/useOnSuccessUpdate';

const AddTeam = ({ row, onEntityUpdated }) => {
  const [teams, setTeams] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const form = useForm({
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  });

  useOnSuccessUpdate(updateSuccess, () => {
    onEntityUpdated();
    setUpdateSuccess(false);
  });

  const getTeamId = (teamName) => {
    const selectedTeam = teams.find((team) => team.startsWith(teamName));
    return selectedTeam ? selectedTeam.split(':')[1] : '';
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`/api/admin/teams/no-league`);
        const data = await res.json();

        setTeams(data?.map((team) => team.name + ':' + team._id));
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    fetchTeams();
  }, [row]);

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
    const teamId = getTeamId(formData.names);

    try {
      const res = await fetch(`/api/league/addTeam/${row._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data!');
      }
      setUpdateSuccess(true);
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
        data={row}
        form={form}
        fields={fields}
      />
    </div>
  );
};

export default AddTeam;
