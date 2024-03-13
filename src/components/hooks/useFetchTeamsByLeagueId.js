/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export const useFetchTeamByLeagueId = (id) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeamByLeagueId = async () => {
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

      if (Array.isArray(data)) {
        setTeams(data.map((team) => team.name + ':' + team._id));
      } else {
        console.error('Error: data is not an array');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    fetchTeamByLeagueId();
  }, [id]);

  return teams;
};
