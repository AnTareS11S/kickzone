import { useEffect, useState } from 'react';

export const GetSeasonByMatchId = (matchId) => {
  const [season, setSeason] = useState([]);

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const res = await fetch(`/api/referee/season/${matchId}`);
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
