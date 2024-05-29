import { useEffect, useState } from 'react';

export const useFetchPlayerStatsById = (playerId) => {
  const [playerStats, setPlayerStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerStatsById = async () => {
      try {
        const res = await fetch(`/api/player/player-top-stats/${playerId}`);
        const data = await res.json();
        setPlayerStats(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStatsById();
  }, [playerId]);

  return { playerStats, loading, error };
};
