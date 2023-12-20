/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import TableModal from '../../TableModal';

const RemoveTeamFromLeague = ({ row, teams }) => {
  const [team, setTeam] = useState([]);

  const isEmpty = teams.some((team) => team === '');

  useEffect(() => {
    if (!isEmpty) {
      const getTeams = async () => {
        try {
          const res = await fetch(`/api/admin/leagues/teams`, {
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
      const res = await fetch(`/api/league/delete/${row.original._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setTeam(team.filter((team) => team._id !== teamId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableModal
      label='Remove Team'
      title='Remove Team'
      desc='Remove Team From League'
      row={row}
      items={team}
      handleDelete={handleDeleteTeamFromLeague}
    />
  );
};

export default RemoveTeamFromLeague;
