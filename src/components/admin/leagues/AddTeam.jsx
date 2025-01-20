import { useEffect, useState } from 'react';
import ModalActions from '../../ModalActions';
import { useForm } from 'react-hook-form';
import { useOnSuccessUpdate } from '../../../hook/useOnSuccessUpdate';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const teamSchema = z.object({
  names: z.string().min(1, { message: 'Please select a team' }),
});

const AddTeam = ({ row, onEntityUpdated }) => {
  const [teams, setTeams] = useState([
    {
      id: '',
      name: '',
    },
  ]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      names: '',
    },
    mode: 'onChange',
  });

  useOnSuccessUpdate(updateSuccess, () => {
    onEntityUpdated();
    setUpdateSuccess(false);
  });

  const getTeamId = (teamName) => {
    console.log('teamName: ', teamName);
    const selectedTeam = teams.find((team) => team.name.startsWith(teamName));
    return selectedTeam ? selectedTeam.id : '';
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`/api/admin/teams/no-league`);
        const data = await res.json();

        setTeams(data?.map((team) => ({ id: team._id, name: team.name })));
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
      idFlag: 'true',
    },
  ];

  const onSubmit = async (formData) => {
    console.log('formData: ', formData);
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
      setIsModalOpen(false);
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
      />
    </div>
  );
};

export default AddTeam;
