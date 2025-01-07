import { useEffect, useState } from 'react';
import TableModal from '../../TableModal';
import { useOnSuccessUpdate } from '../../../hook/useOnSuccessUpdate';

const RemoveTeamFromLeague = ({ row, teams, onEntityUpdated }) => {
  const [team, setTeam] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const isEmpty = teams.some((team) => team === '');

  useOnSuccessUpdate(updateSuccess, () => {
    onEntityUpdated();
    setUpdateSuccess(false);
  });

  useEffect(() => {
    if (!isEmpty) {
      const getTeams = async () => {
        try {
          const res = await fetch(`/api/admin/league/teams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teams }),
          });
          const data = await res.json();
          setTeam(data);
        } catch (error) {
          console.log(error);
        }
      };
      getTeams();
    }
  }, [teams, isEmpty]);

  const handleDeleteTeamFromLeague = async (teamId) => {
    try {
      const res = await fetch(`/api/league/delete/${row._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUpdateSuccess(true);
      setTeam(team.filter((team) => team._id !== teamId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableModal
      title='Remove Team'
      desc='Remove Team From League'
      row={row}
      items={team}
      handleDelete={handleDeleteTeamFromLeague}
    />
  );
};

export default RemoveTeamFromLeague;
