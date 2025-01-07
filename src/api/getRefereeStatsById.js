import { useEffect, useState } from 'react';

export const GetRefereeStatsById = (refereeId) => {
  const [refereeStats, setRefereeStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefereeStatsById = async () => {
      try {
        const res = await fetch(`/api/referee/referee-stats/${refereeId}`);
        const data = await res.json();
        setRefereeStats(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchRefereeStatsById();
  }, [refereeId]);

  return { refereeStats, loading };
};
