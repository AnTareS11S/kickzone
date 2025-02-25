import { useEffect, useState } from 'react';

export const GetSeasonByMatchId = (matchId) => {
  const [season, setSeason] = useState([]);

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/referee/season/${matchId}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch season data!');
        }
        const data = await res.json();
        setSeason(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSeasonData();
  }, [matchId]);

  return season;
};
