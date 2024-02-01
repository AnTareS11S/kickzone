/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export const useFetchTeamById = (id) => {
  const [team, setTeam] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchTeamById = async () => {
    try {
      if (!id) {
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/team/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch team data!');
      }
      const data = await res.json();
      setTeam(data);
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

    fetchTeamById();
  }, [id]);

  return team;
};
