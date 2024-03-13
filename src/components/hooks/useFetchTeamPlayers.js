/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export const useFetchTeamPlayers = (id) => {
  const [playersToSelect, setPlayersToSelect] = useState([]);
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
          data.map(
            (player) => player.name + ' ' + player.surname + ':' + player._id
          )
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
