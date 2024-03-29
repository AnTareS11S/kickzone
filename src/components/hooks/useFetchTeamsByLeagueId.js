import { useEffect, useState } from 'react';

export const useFetchTeamsByLeagueId = (id) => {
  const [teams, setTeams] = useState([]);
  const [selectTeams, setSelectTeams] = useState([]);
  const [leagueName, setLeagueName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeamsByLeagueId = async () => {
      try {
        if (!id) {
          return;
        }
        setLoading(true);
        const res = await fetch(`/api/league/teams/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch team data!');
        }
        const data = await res.json();

        setLeagueName(data[0].league.name);

        if (Array.isArray(data)) {
          setSelectTeams(data.map((team) => team.name + ':' + team._id));
          setTeams(data);
        } else {
          console.error('Error: data is not an array');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsByLeagueId();
  }, [id]);

  return { teams, selectTeams, loading, leagueName };
};
