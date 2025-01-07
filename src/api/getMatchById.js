import { useEffect, useState } from 'react';

export const GetMatchById = (id) => {
  const [match, setMatch] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatchById = async () => {
      try {
        if (!id) {
          return;
        }
        setLoading(true);
        const res = await fetch(`/api/referee/get-match/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch match data!');
        }
        const data = await res.json();
        setMatch(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchById();
  }, [id]);

  return { match, loading };
};
