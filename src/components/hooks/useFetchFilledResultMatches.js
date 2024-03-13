import { useEffect, useState } from 'react';

export const useFetchFilledResultMatches = (id, isEdited) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatchesData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/referee/filled-matches/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch matches data!');
        }
        const data = await res.json();

        setMatches(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchesData();
  }, [id, isEdited]);

  return matches;
};
