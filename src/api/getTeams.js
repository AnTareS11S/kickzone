import { useEffect, useState } from 'react';

export const GetTeams = () => {
  const [teams, setTeams] = useState([
    {
      id: '',
      name: '',
    },
  ]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/team`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch team data!');
        }
        const data = await res.json();
        setTeams(data?.map((team) => ({ id: team._id, name: team.name })));
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeamData();
  }, []);

  return teams;
};
