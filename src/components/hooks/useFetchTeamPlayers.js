/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export const useFetchTeamPlayers = (id) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeamPlayers = async () => {
    try {
      if (!id) {
        return null;
      }
      setLoading(true);
      const res = await fetch(`/api/admin/team-player/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch players data!');
      }
      const data = await res.json();

      setPlayers(
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
  useEffect(() => {
    if (loading) {
      return;
    }
    fetchTeamPlayers();
  }, [id]);

  return players;
};
