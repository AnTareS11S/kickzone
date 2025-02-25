import { useEffect, useState } from 'react';

export const GetSeasonByLeagueId = (leagueId) => {
  const [season, setSeason] = useState([]);
  const [league, setLeague] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/season/get-season/${leagueId}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch season data!');
        }
        const data = await res.json();
        setSeason(data.season);
        setLeague(data.leagueName);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [leagueId]);

  return { season, league, loading };
};
