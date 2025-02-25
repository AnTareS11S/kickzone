import { useEffect, useState } from 'react';

export const GetMatchResultById = (id) => {
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/referee/match-result/${id}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch match data!');
        }
        const data = await res.json();

        setResult(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [id]);

  return { result, loading };
};
