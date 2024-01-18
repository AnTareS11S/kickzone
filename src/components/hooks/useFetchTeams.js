import { useEffect, useState } from 'react';

export const useFetchTeams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await fetch('/api/admin/team');
        if (!res.ok) {
          throw new Error('Failed to fetch team data!');
        }
        const data = await res.json();
        setTeams(data.map((team) => team.name + ':' + team._id));
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeamData();
  }, []);

  return teams;
};
