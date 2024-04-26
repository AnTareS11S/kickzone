import { useEffect, useState } from 'react';

export const useFetchTeamPlayersByWantedTeam = (id) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      try {
        const res = await fetch(`/api/player/get-wanted-team/${id}`);
        const data = await res.json();
        setPlayers(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamPlayers();
  }, [id]);

  return { players, loading, error };
};
