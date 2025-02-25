import { useEffect, useState } from 'react';

export const GetTeamsByLeagueId = (id) => {
  const [teams, setTeams] = useState([]);
  const [selectTeams, setSelectTeams] = useState([
    {
      id: '',
      name: '',
    },
  ]);
  const [leagueName, setLeagueName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamsByLeagueId = async () => {
      try {
        if (!id) {
          return;
        }
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/league/teams/${id}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch team data!');
        }
        const data = await res.json();

        setLeagueName(data[0]?.league?.name);

        if (Array.isArray(data)) {
          setSelectTeams(
            data?.map((team) => ({ id: team._id, name: team.name }))
          );
          setTeams(data);
        } else {
          console.error('Error: data is not an array');
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsByLeagueId();
  }, [id]);

  return { teams, selectTeams, loading, leagueName };
};
