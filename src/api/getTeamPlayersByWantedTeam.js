import { useEffect, useState } from 'react';

export const GetTeamPlayersByWantedTeam = (id) => {
  const [players, setPlayers] = useState([
    {
      id: '',
      name: '',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      try {
        const res = await fetch(`/api/player/get-wanted-team/${id}`);
        const data = await res.json();
        setPlayers(
          data.map((player) => ({
            id: player._id,
            name: player.name + ' ' + player.surname,
          }))
        );
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
