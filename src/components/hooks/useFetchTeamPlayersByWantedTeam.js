/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useFetchCoachByUserId } from './useFetchCoachByUserId';
export const useFetchTeamPlayersByWantedTeam = () => {
  const coach = useFetchCoachByUserId();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeamPlayers = async () => {
    try {
      if (!coach?.currentTeam) {
        return;
      }
      setLoading(true);
      const res = await fetch(
        `/api/player/get-wanted-team/${coach?.currentTeam}`
      );
      if (!res.ok) {
        throw new Error('Failed to fetch players data!');
      }
      const data = await res.json();

      setPlayers(data);
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
  }, [coach?.currentTeam]);

  return players;
};
