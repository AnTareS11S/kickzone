import { useEffect, useState } from 'react';

export const useFetchPlayerById = (id, isChanged) => {
  const [player, setPlayer] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerById = async () => {
      try {
        if (!id) return;
        const res = await fetch(`/api/player/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch player data!');
        }
        const data = await res.json();
        setPlayer(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerById();
  }, [id, isChanged]);

  return { player, loading };
};
