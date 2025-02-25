import { useEffect, useState } from 'react';

export const GetPlayerStatsById = (playerId) => {
  const [playerStats, setPlayerStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerStatsById = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/player/player-top-stats/${playerId}`
        );
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
