import { useEffect, useState } from 'react';

export const GetTeamStatsByLeagueId = (leagueId) => {
  const [teamStats, setTeamStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamStatsByLeagueId = async () => {
      try {
        const res = await fetch(`/api/league/teams-stats/${leagueId}`);
        const data = await res.json();
        setTeamStats(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTeamStatsByLeagueId();
  }, [leagueId]);

  return { teamStats, loading, error };
};
