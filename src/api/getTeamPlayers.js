import { useEffect, useState } from 'react';

export const GetTeamPlayers = (id) => {
  const [playersToSelect, setPlayersToSelect] = useState([
    {
      id: '',
      name: '',
    },
  ]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const res = await fetch(`/api/admin/team-player/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch players data!');
        }
        const data = await res.json();

        setPlayers(data);

        setPlayersToSelect(
          data.map((player) => ({
            id: player._id,
            name: `${player.name} ${player.surname}`,
          }))
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamPlayers();
  }, [id]);

  return { playersToSelect, players, loading };
};
